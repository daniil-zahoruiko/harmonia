import os
import helpers
from song import Song
from artist import Artist
from flask_mysqldb import MySQL, MySQLdb


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
        query = "SELECT id, name, artistId, albumId FROM songs"

        query_res = self.execute_query(query=query, fetch_func="fetchall")

        res = []

        for (id, name, artist_id, album_id) in query_res:
            res.append(Song(id, name, artist_id, album_id))

        return res

    def read_image_file(self, id):
        dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), "images")

        if(not os.path.exists(dir)):
            os.mkdir(dir, 0o666)

        dir = os.path.join(dir, id + ".webp")

        if(not os.path.isfile(dir)):
            query = "SELECT image FROM main.songs WHERE id = %s"

            file = self.execute_query(query=query,args=(id, ), fetch_func="fetchone")[0]

            helpers.write_file(file, dir)

        return "./images/" + id + ".webp"

    def read_song_file(self, id):
        dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), "songs")

        if(not os.path.exists(dir)):
            os.mkdir(dir, 0o666)

        dir = os.path.join(dir, id + ".mp3")

        if(not os.path.isfile(dir)):
            query = "SELECT data FROM songs WHERE id = %s"

            file = self.execute_query(query=query, args=(id, ), fetch_func="fetchone")[0]

            helpers.write_file(file, dir)


        return "./songs/" + id + ".mp3"

    def write_song(self, name, data, artist_id, album_id):
        id = self.get_number_of_songs() + 1
        query = f"INSERT INTO songs(id, name, data, artistId, albumId) VALUES (%s, %s, %s, %s, %s)"

        args = (id, name, data, artist_id, album_id)

        self.execute_query(query=query, args=args, commit=True)

    def add_image(self, id, data):
        query = "UPDATE songs SET image = %s WHERE id = %s"

        self.execute_query(query=query, args=(data, id), commit=True)


    def get_artist_by_id(self, id):
        query = "SELECT * FROM artists WHERE id = %s"

        (id, name) = self.execute_query(query=query, args=(id, ), fetch_func="fetchone")

        return Artist(id, name)

    def get_number_of_songs(self):
        return self.execute_query(query="SELECT COUNT(*) FROM songs", fetch_func="fetchone")[0]

    def __del__(self):
        self.mysql.connection.close()