import helpers
import bcrypt
from song import Song
from artist import Artist
from album import Album
from playlist import Playlist
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

    def get_last_id(self, table):
        query_res = self.execute_query(query=f"SELECT id FROM {table} ORDER BY id DESC LIMIT 1;", fetch_func="fetchone")
        if query_res:
            return query_res[0]
        return 0

    # fields should be a comma-separated string of fields to be selected from the table
    def select_by_unique_field(self, fields, table, criteria_field, criteria_value):
        query = f"SELECT {fields} FROM {table} WHERE {criteria_field}=%s"

        query_res = self.execute_query(query=query, args=(criteria_value,), fetch_func="fetchone")

        if(fields == "*" or query_res is None):
            return query_res
        
        return query_res[0]

    def select_by_id(self, fields, table, id):
        return self.select_by_unique_field(fields, table, "id", id)

    def select_all_rows(self, fields, table):
        return self.execute_query(query=f"SELECT {fields} FROM {table}", fetch_func="fetchall")

    def select_all_rows_by_criteria(self, fields, table, criteria_field, criteria_value):
        return self.execute_query(query=f"SELECT {fields} FROM {table} WHERE {criteria_field}=%s", args=(criteria_value,), fetch_func="fetchall")

    def update_single_field_by_id(self, field, value, table, id):
        self.execute_query(query=f"UPDATE {table} SET {field}=%s WHERE id=%s", args=(value, id), commit=True)
    
    def delete_single_row_by_id(self,table,id):
        self.execute_query(query=f"DELETE FROM {table} WHERE id={id}",commit=True)

    #endregion
        
    #region Selecting data
    
    def get_all_songs_query(self):
        query_res = self.select_all_rows("id, name, genre, artistId, albumId, length, streams", "songs")

        res = []

        for (id, name, genre, artist_id, album_id, length,streams) in query_res:
            res.append(Song(id, name, genre, artist_id, album_id, length,streams))

        return res
    
    def get_all_artists_query(self):
        query_res = self.select_all_rows("id, name", "artists")
        res = []
        for (id,name) in query_res:
            res.append(Artist(id,name))

        return res
    
    def get_all_albums_query(self):
        query_res = self.select_all_rows("id, name, artistId", "albums")
        res = []
        for (id,name,artist_id) in query_res:
            res.append(Album(id,name,artist_id))

        return res

    def read_image_file(self, id, table):
        return self.select_by_id("image", table, id)

    def read_song_file(self, id):
        return self.select_by_id("data", "songs", id)

    def get_artist_by_id(self, id):
        artist = self.select_by_id("*", "artists", id)

        return Artist(artist[0], artist[1])

    def get_album_by_id(self, id):
        album = self.select_by_id("*", "albums", id)

        return Album(album[0], album[1], album[2])

    def get_playlists_by_user_id(self, user_id):
        playlists = self.select_all_rows_by_criteria("id, name, description, songs", "playlists", "userId", user_id)

        res = []

        for(id, name, description, songs) in playlists:
            res.append(Playlist(id, name, description, songs))

        return res

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

    # playlist update
    def update_playlist_songs(self,id,songs):
        self.update_single_field_by_id("songs",songs,"playlists",id)

    def update_playlist_name(self,id,name):
        self.update_single_field_by_id("name",name,"playlists",id)

    def update_playlist_description(self,id,description):
        self.update_single_field_by_id("description",description,"playlists",id)

    def update_playlist_image(self,id,image):
        self.update_single_field_by_id("image",image,"playlists",id)

    # liked songs update
    def update_liked_songs(self,liked_songs,user_id):
        self.update_single_field_by_id("likedSongs", liked_songs, "users", user_id)

    # favorite artists update
    def update_favorite_artists(self,fav_artists,user_id):
        self.update_single_field_by_id("favArtists", fav_artists, "users", user_id)

    # song streams update
    def update_streams(self,song_id):
        streams = self.select_by_id("streams","songs",song_id) + 1
        self.update_single_field_by_id("streams",streams,"songs",song_id)

    # user data update
    def update_username(self,user_id,username):
        self.update_single_field_by_id("username", username, "users", user_id)

    def update_email(self,user_id,email):
        self.update_single_field_by_id("email", email, "users", user_id)

    def update_password(self,user_id,password):
        salt = bcrypt.gensalt()
        self.update_single_field_by_id("password", bcrypt.hashpw(password.encode('utf-8'), salt), "users", user_id)

    def update_full_name(self,user_id,full_name):
        self.update_single_field_by_id("fullName", full_name, "users", user_id)

    def update_settings(self,user_id,settings):
        self.update_single_field_by_id("settings",settings,"users",user_id)
    #endregion
    
    #region Creating data

    def create_user(self, username, password,email,full_name):
        query = "INSERT INTO users(id, username,email, password, fullName,likedSongs,favArtists,settings) VALUES (%s, %s, %s, %s,%s,%s,%s,%s)"

        salt = bcrypt.gensalt()

        args = (self.get_last_id("users")+1,
                username,
                email,
                bcrypt.hashpw(password.encode('utf-8'), salt),
                full_name,
                json.dumps({"likedSongs":{}}),
                json.dumps({"favArtists":{}}),
                json.dumps({"language":"english"}))

        self.execute_query(query=query, args=args, commit=True)

    def create_song(self, name, genre, data, artist_id, album_id):
        id = self.get_last_id("songs") + 1
        length = helpers.get_mp3_length(data)
        query = "INSERT INTO songs(id, name, genre, data, artistId, albumId, length) VALUES (%s, %s, %s, %s, %s, %s, %s)"

        args = (id, name, genre, data, artist_id, album_id, length)  # if the song is not mp3, will this work?

        print(args)

        self.execute_query(query=query, args=args, commit=True)

        return Song(id, name, genre, artist_id, album_id, length,0)
    
    def create_user_song(self, name, genre, audio, image, artist_id, album_id):
        id = self.get_last_id("songs") + 1
        length = helpers.get_mp3_length(audio)
        query = "INSERT INTO songs(id, name, genre, data, image, artistId, albumId, length) VALUES (%s, %s, %s,%s, %s, %s, %s, %s)"

        args = (id, name, genre, audio, image, artist_id, album_id, length)  # if the song is not mp3, will this work

        self.execute_query(query=query, args=args, commit=True)

        return Song(id, name, genre, artist_id, album_id, length,0)
    
    def create_album(self,name,artist_id,image):
        id = self.get_last_id("albums") + 1
        query = "INSERT INTO albums(id, name, artistId, image) VALUES (%s, %s, %s,%s)"

        args = (id,name,artist_id,image)

        self.execute_query(query=query, args=args,commit=True)

        return id

    def create_artist(self, name, image,user_id):
        id = self.get_last_id("artists") + 1
        query = "INSERT INTO artists(id, name, image) VALUES (%s, %s, %s)"

        args = (id, name, image)

        self.execute_query(query=query, args=args, commit=True)
        self.update_single_field_by_id("artistId",id,"users",user_id)
        return id

    def create_playlist(self,id,name):
        query = "INSERT INTO playlists(id, name,description, userId, songs) VALUES (%s, %s, %s, %s,%s)"

        args = (self.get_last_id("playlists") + 1,name,"",id,json.dumps({}))

        self.execute_query(query=query, args=args,commit=True)

    #endregion

    #region Delete data

    def remove_playlist(self,id):
        self.delete_single_row_by_id("playlists",id)

    #endregion

    def __del__(self):
        self.mysql.connection.close()