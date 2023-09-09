import os
import helpers
import bcrypt
from song import Song
from artist import Artist
from album import Album
from user import User
from flask_mysqldb import MySQL, MySQLdb
import json


class DBConnection:
    def __init__(self, app):
        self.mysql = MySQL(app)

    #region DB interface

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

    def get_table_length(self, table):
        return self.execute_query(query=f"SELECT COUNT(*) FROM {table}", fetch_func="fetchone")[0]

    # fields should be a comma-separated string of fields to be selected from the table
    def select_by_unique_field(self, fields, table, criteria_field, criteria_value):
        query = f"SELECT {fields} FROM {table} WHERE {criteria_field}=%s"

        query_res = self.execute_query(query=query, args=(criteria_value,), fetch_func="fetchone")

        if(fields == "*"):
            return query_res
        
        return query_res[0]

    def select_by_id(self, fields, table, id):
        return self.select_by_unique_field(fields, table, "id", id)

    def select_all_rows(self, fields, table):
        return self.execute_query(query=f"SELECT {fields} FROM {table}", fetch_func="fetchall")

    def update_single_field_by_id(self, field, value, table, id):
        self.execute_query(query=f"UPDATE {table} SET {field}=%s WHERE id=%s", args=(value, id), commit=True)

    #endregion
        
    #region Selecting data
    
    def get_all_songs_query(self):
        query_res = self.select_all_rows("id, name, genre, artistId, albumId, length", "songs")

        res = []

        for (id, name, genre, artist_id, album_id, length) in query_res:
            res.append(Song(id, name, genre, artist_id, album_id, length))

        return res
    
    def get_all_artists_query(self):
        query_res = self.select_all_rows("*", "artists")
        res = []
        for (id,name) in query_res:
            res.append(Artist(id,name))

        return res
    
    def get_all_albums_query(self):
        query_res = self.select_all_rows("*", "albums")
        res = []
        for (id,name,artist_id) in query_res:
            res.append(Album(id,name,artist_id))

        return res

    def read_image_file(self, id):
        return self.select_by_id("image", "songs", id)

    def read_song_file(self, id):
        return self.select_by_id("data", "songs", id)

    def get_artist_by_id(self, id):
        artist = self.select_by_id("*", "artists", id)

        return Artist(artist[0], artist[1])

    def get_album_by_id(self, id):
        album = self.select_by_id("*", "albums", id)

        return Album(album[0], album[1], album[2])
    
    def get_user_id_by_username(self, username):
        return self.select_by_unique_field("id", "users", "username", username)

    def get_user_id_by_email(self, email):
        return self.select_by_unique_field("id", "users", "email", email)

    def get_user_by_id(self, id):
        user = self.select_by_id("*", "users", id)

        return User(user[0], user[1], user[2], user[3], user[4],user[5],user[6],user[7],user[8])
    
    #endregion

    #region Updating data

    def update_image(self, id, data):
        self.update_single_field_by_id("image", data, "songs", id)

    def update_liked_songs(self,liked_songs,user_id):
        self.update_single_field_by_id("likedSongs", liked_songs, "users", user_id)

    def update_favorite_artists(self,fav_artists,user_id):
        self.update_single_field_by_id("favArtists", fav_artists, "users", user_id)

    def change_username(self,user_id,username):
        self.update_single_field_by_id("username", username, "users", user_id)

    def change_email(self,user_id,email):
        self.update_single_field_by_id("email", email, "users", user_id)

    def change_full_name(self,user_id,full_name):
        self.update_single_field_by_id("fullName", full_name, "users", user_id)

    #endregion
    
    #region Creating data

    def create_user(self, username, password,email,full_name):
        query = "INSERT INTO users(id, username,email, password, fullName,likedSongs,favArtists,settings) VALUES (%s, %s, %s, %s,%s,%s,%s,%s)"

        salt = bcrypt.gensalt()

        args = (self.get_table_length("users") + 1,
                username,email,
                bcrypt.hashpw(password.encode('utf-8'), salt),
                full_name,
                json.dumps({"likedSongs":[]}),
                json.dumps({"favArtists":[]}),
                json.dumps({"language":"english"}))

        self.execute_query(query=query, args=args, commit=True)

    def create_song(self, name, genre, data, artist_id, album_id):
        id = self.get_table_length("songs") + 1
        query = "INSERT INTO songs(id, name, genre, data, artistId, albumId, length) VALUES (%s, %s, %s, %s, %s, %s, %s)"

        args = (id, name, genre, data, artist_id, album_id, helpers.get_mp3_length(data))  # if the song is not mp3, will this work?

        self.execute_query(query=query, args=args, commit=True)

    #endregion

    def __del__(self):
        self.mysql.connection.close()