from io import BytesIO
from mutagen import MP3

def write_file(data, filename):
    with open(filename, 'wb') as f:
        f.write(data)

def read_file(filename):
    with open(filename, 'rb') as f:
        data = f.read()
    return data

def get_mp3_length(blob):
    data = BytesIO(blob)

    audio = MP3(data)

    return audio.info.length