from db_connection import DBConnection
from song import Song

USER = "root"
PASSWORD = "1234"
HOST = "127.0.0.1"
DATABASE = "main"

def establish_db_connection():
    return DBConnection(USER, PASSWORD, HOST, DATABASE)

def get_all_songs(db_connection):
    songs = db_connection.get_all_songs_query()

    data =[{"id":str(song.get_id()), "title":song.get_name(), "file":f"{song.get_id()}.mp3", "cover":"test1.webp", "artist":db_connection.get_artist_by_id(song.get_artist_id()).get_name()} for song in songs]

    return data

def get_song_file(db_connection, id):
    return db_connection.read_song_file(id)

def get_image_file(db_connection, id):
    return db_connection.read_image_file(id)