import os
import helpers
import bcrypt
from song import Song
from artist import Artist
from album import Album
from user import User
from flask_mysqldb import MySQL, MySQLdb
#from mutagen.mp3 import MP3


class DBConnection:
    def __init__(self, app):
        self.mysql = MySQL(app)

    def execute_query(self, query, args=None, fetch_func=None, fetch_size=0, commit=False):
        cursor = self.mysql.connection.cursor()

        try:
            cursor.execute(query, args)
        except MySQLdb.Error as e:
            print(e)
            cursor.close()
            return None

        if commit:
            self.mysql.connection.commit()

        if fetch_func == None:
            cursor.close()
            return None

        valid_fetch_func = ("fetchall", "fetchone", "fetchmany")

        if fetch_func.lower() not in valid_fetch_func:
            print("Invalid fetch function")
            cursor.close()
            return None

        res = None
        try:
            if fetch_func == "fetchall":
                res = cursor.fetchall()
            elif fetch_func == "fetchone":
                res = cursor.fetchone()
            else:
                res = cursor.fetchmany(fetch_size)
        except MySQLdb.Error as e:
            print(e)
        finally:
            cursor.close()
            return res


    def get_all_songs_query(self):
        query = "SELECT id, name, genre, artistId, albumId FROM songs"

        query_res = self.execute_query(query=query, fetch_func="fetchall")

        res = []

        for (id, name, genre, artist_id, album_id) in query_res:
            res.append(Song(id, name, genre, artist_id, album_id))

        return res

    def read_image_file(self, id):
        query = "SELECT image FROM songs WHERE id = %s"

        file = self.execute_query(query=query,args=(id, ), fetch_func="fetchone")[0]

        return file

    def read_song_file(self, id):
        query = "SELECT data FROM songs WHERE id = %s"

        file = self.execute_query(query=query, args=(id, ), fetch_func="fetchone")[0]

        return file

    def write_song(self, name, genre, data, artist_id, album_id):
        id = self.get_table_length("songs") + 1
        query = "INSERT INTO songs(id, name, genre, data, artistId, albumId) VALUES (%s, %s, %s, %s, %s, %s)"

        #audio = MP3(data)
        #print(audio.info.length)

        args = (id, name, genre, data, artist_id, album_id)

        self.execute_query(query=query, args=args, commit=True)

    def add_image(self, id, data):
        query = "UPDATE songs SET image = %s WHERE id = %s"

        self.execute_query(query=query, args=(data, id), commit=True)


    def get_artist_by_id(self, id):
        query = "SELECT * FROM artists WHERE id = %s"

        (id, name) = self.execute_query(query=query, args=(id, ), fetch_func="fetchone")

        return Artist(id, name)

    def get_album_by_id(self, id):
        query = "SELECT * FROM albums WHERE id = %s"

        (id, name, artist_id) = self.execute_query(query=query, args=(id, ), fetch_func="fetchone")

        return Album(id, name, artist_id)
    
    def get_user_id_by_username(self, username):
        query = "SELECT id FROM users WHERE username = %s"

        id = self.execute_query(query=query, args=(username, ), fetch_func="fetchone")

        return id

    def get_user_by_id(self, id):
        query = "SELECT * FROM users WHERE id = %s"

        (id, username, password, full_name, display_name, email) = self.execute_query(query=query, args=(id, ), fetch_func="fetchone")

        return User(id, username, password, full_name, display_name, email)

    def create_user(self, username, password):
        query = "INSERT INTO users(id, username, password, displayName) VALUES (%s, %s, %s, %s)"

        salt = bcrypt.gensalt()

        args = (self.get_table_length("users") + 1, username, bcrypt.hashpw(password.encode('utf-8'), salt), "user_display_name")

        self.execute_query(query=query, args=args, commit=True)

    def get_table_length(self, table):
        return self.execute_query(query=f"SELECT COUNT(*) FROM {table}", fetch_func="fetchone")[0]

    def __del__(self):
        self.mysql.connection.close()