import os
from supabase import create_client, Client
from fastapi import HTTPException
from dotenv import load_dotenv
import shutil
from util_functions import generate_random_uuid

load_dotenv()


class SupabaseStorageClass:
    def __init__(self):
        self.SUPABASE_URL = os.environ.get("SUPABASE_URL")
        self.SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")
        if not self.SUPABASE_URL or not self.SUPABASE_KEY:
            raise ValueError("Supabase URL and Key must be set in environment variables")

        self.client: Client = create_client(self.SUPABASE_URL, self.SUPABASE_KEY)
        self.bucket_name = os.environ.get("SUPABASE_BUCKET_NAME")

    def upload_project_zip_and_get_signedurl(self, user_uuid: str,requestHash: str, local_file_path: str) -> str:
        curr_request_uuid = generate_random_uuid()
        zip_file_path = f"{local_file_path}.zip"
        folder_to_zip(local_file_path, local_file_path)
        storage_path = f"{curr_request_uuid}_project.zip"
        print(f"Uploading file to Supabase at path: {storage_path}")
        try:
            with open(zip_file_path, "rb") as f:
                response = self.client.storage.from_(self.bucket_name).upload(storage_path, f)
                resp = self.client.storage.from_(self.bucket_name).create_signed_url(storage_path, 60 * 60 * 24 * 7)
                signed_url = resp.get("signedURL")
                self.insert_request_details_in_db(user_uuid, curr_request_uuid,requestHash, storage_path, signed_url)
            return signed_url
        except FileNotFoundError:
            raise HTTPException(status_code=400, detail=f"Local file not found: {local_file_path}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def insert_request_details_in_db(self, user_uuid: str, curr_request_uuid: str, hashed_request: str, storage_path: str,
                                     signed_url: str) -> None:
        try:
            data = {
                "user_uuid": user_uuid,
                "request_id": curr_request_uuid,
                "request_hash": hashed_request,
                "storage_path": storage_path,
                "signed_url": signed_url
            }
            response = self.client.table("user_projects").insert(data).execute()
            print(f"Request details inserted into DB: {response}")
        except Exception as e:
            print(f"Error inserting request details into DB: {e}")
            raise e

    def get_signed_url_cache(self, request_hash: str, user_uuid:str) -> str:
        try:
            response = self.client.table("user_projects").select("*").eq("request_hash", request_hash).eq("user_uuid",user_uuid).execute()
            if response.data and len(response.data) > 0:
                print(f"Request with hash {request_hash} already exists in DB.")
                signed_url = response.data[0].get("signed_url", "")
                storage_path = response.data[0].get("storage_path", "")
                if self.is_valid_signed_url(storage_path):
                    return signed_url
                else:
                    print("Signed URL expired, generating a new one.")
                    new_signed_url = self.update_signed_url_of_file(storage_path)
                    self.client.table("user_projects").update({"signed_url": new_signed_url}).eq("request_hash", request_hash).eq("user_uuid",user_uuid).execute()
                    return new_signed_url
            return ""
        except Exception as e:
            print(f"Error checking request in DB: {e}")
            raise e

    def is_valid_signed_url(self, storage_path: str) -> bool:
        try:
            response = self.client.storage.from_(self.bucket_name).download(storage_path)
            print("Signed URL is valid.")
            return response is not None
        except Exception as e:
            print(f"Signed URL is not valid: {e}")
            return False

    def update_signed_url_of_file(self, storage_path:str) -> str:
        try:
            resp = self.client.storage.from_(self.bucket_name).create_signed_url(storage_path, 7*24*60*60)
            return resp.get("signedURL")
        except Exception as e:
            print(f"Error updating signed URL: {e}")
            raise e


def folder_to_zip(folder_path: str, output_zip_path: str) -> None:
    try:
        shutil.make_archive(output_zip_path, 'zip', folder_path)
        print(f"Folder '{folder_path}' successfully zipped to '{output_zip_path}.zip'")
    except Exception as e:
        print(f"Error zipping folder: {e}")
        raise e
