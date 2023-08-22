from db_connection import DBConnection
from song import Song

USER = "root"
PASSWORD = "1234"
HOST = "127.0.0.1"
DATABASE = "main"


def establish_db_connection(app):
    return DBConnection(app)

def get_all_songs(db):
    songs = db.get_all_songs_query()

    data =[{"id":str(song.get_id()), "title":song.get_name(), "genre": song.get_genre(), "file":f"{song.get_id()}.mp3", "cover":f"{song.get_id()}.webp", "artist":db.get_artist_by_id(song.get_artist_id()).get_name()} for song in songs]

    return data

def get_song_file(db, id):
    return db.read_song_file(id)

def get_image_file(db, id):
    return db.read_image_file(id)