from io import BytesIO
from mutagen import MP3
import os

def write_file(data, path):
    with open(path, 'w') as f:
        f.write(data)
    print("File succesfully downloaded")

def read_file(filename):
    if file_exists(filename):
        with open(filename, 'r') as f:
            data = f.read()        
        return data
    print("The file does not exists")
    return None

def get_mp3_length(blob):
    data = BytesIO(blob)

    audio = MP3(data)

    return audio.info.length

def delete_file(filename):
    if file_exists(filename):
        os.remove(filename)
    else:
        print("The file does not exist")

def file_exists(path):
    if os.path.exists(path):
        return True
    return False