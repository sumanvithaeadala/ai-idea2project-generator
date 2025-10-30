import hashlib
import uuid


def convert_string_to_md5(input_string: str) -> str:
    md5_hash = hashlib.md5(input_string.encode())
    return md5_hash.hexdigest()


def generate_random_uuid() -> str:
    return str(uuid.uuid4())
