from db_connection import DBConnection
from song import Song
import helpers
import os
import json

USER = "root"
PASSWORD = "1234"
HOST = "127.0.0.1"
DATABASE = "main"


def establish_db_connection(app):
    return DBConnection(app)

def try_get_user(db, username):
    return db.get_user_id_by_username(username)

def try_get_user_by_email(db,email):
    return db.get_user_id_by_email(email)

def verify_user(db, user_id, input_password):
    user = db.get_user_by_id(user_id)

    return user.get_user_data() if user.verify_password(input_password) else None

def get_user(db,user_id):
    user = db.get_user_by_id(user_id)
    return user.get_user_data()

def create_user(db, username, password,email,full_name):
    db.create_user(username, password,email,full_name)

def get_all_songs(db):
    songs = db.get_all_songs_query()

    data =[{"id":str(song.get_id()),
            "title":song.get_name(),
            "genre": song.get_genre(),
            "file":f"{song.get_id()}.mp3",
            "cover":f"{song.get_id()}.webp",
            "artist":db.get_artist_by_id(song.get_artist_id()).get_name(),
            "album":db.get_album_by_id(song.get_album_id()).get_name()} for song in songs]

    return data

def like_song(db,liked_songs,user_id):
    db.update_liked_songs(json.dumps(liked_songs),user_id)

def get_song_file(db, id):
    return db.read_song_file(id)

def get_image_file(db, id):
    return db.read_image_file(id)

def change_username(db,user_id,username):
    return db.change_username(user_id,username)

def change_email(db,user_id,email):
    return db.change_email(user_id,email)

def change_full_name(db,user_id,full_name):
    return db.change_full_name(user_id,full_name)

def create_cache(data,filename):
    new_path = os.path.join(os.getcwd(),"cache",filename)
    helpers.write_file(data,new_path)

def read_cache(filename):
    new_path = os.path.join(os.getcwd(),"cache",filename)
    return helpers.read_file(new_path)

def delete_cache(filename):
    new_path = os.path.join(os.getcwd(),"cache",filename)
    return helpers.delete_file(new_path)
