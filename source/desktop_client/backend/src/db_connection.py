import os
import helpers
from song import Song
from artist import Artist
from flask_mysqldb import MySQL


class DBConnection:
    def __init__(self, app):
        self.mysql = MySQL(app)
    def get_all_songs_query(self):
        cursor = self.mysql.connection.cursor()
        query = "SELECT id, name, artistId, albumId FROM songs"

        cursor.execute(query)

        res = []

        for (id, name, artist_id, album_id) in cursor:
            res.append(Song(id, name, artist_id, album_id))

        cursor.close()

        return res

    def read_image_file(self, id):
        dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), "images")

        if(not os.path.exists(dir)):
            os.mkdir(dir, 0o666)


        dir = os.path.join(dir, id + ".webp")

        if(not os.path.isfile(dir)):
            cursor = self.mysql.connection.cursor()


            query = f"SELECT image FROM main.songs WHERE id = {int(id)}"

            cursor.execute(query)

            file = cursor.fetchone()[0]

            helpers.write_file(file, dir)

            cursor.close()

        return "./images/" + id + ".webp"

    def read_song_file(self, id):
        dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), "songs")

        if(not os.path.exists(dir)):
            os.mkdir(dir, 0o666)

        dir = os.path.join(dir, id + ".mp3")

        if(not os.path.isfile(dir)):
            cursor = self.mysql.connection.cursor()
            query = f"SELECT data FROM songs WHERE id = {id}"

            cursor.execute(query)

            file = cursor.fetchone()[0]

            helpers.write_file(file, dir)

            cursor.close()


        return "./songs/" + id + ".mp3"

    def write_song(self, name, data, artist_id, album_id):
        cursor = self.mysql.connection.cursor()
        id = self.get_number_of_songs() + 1
        query = f"INSERT INTO songs(id, name, data, artistId, albumId) VALUES (%s, %s, %s, %s, %s)"

        args = (id, name, data, artist_id, album_id)

        cursor.execute(query, args)

        cursor.close()
        self.mysql.commit()




    def add_image(self, id, data):
        cursor = self.mysql.connection.cursor()
        query = "UPDATE songs SET image = %s WHERE id = %s"

        args = (data, id)

        cursor.execute(query, args)

        cursor.close()
        self.mysql.commit()


    def get_artist_by_id(self, id):
        cursor = self.mysql.connection.cursor()
        query = f"SELECT * FROM artists WHERE id = {id}"

        cursor.execute(query)
        (id, name) = cursor.fetchone()

        cursor.close()

        return Artist(id, name)

    def get_number_of_songs(self):
        cursor = self.mysql.connection.cursor()
        cursor.execute("SELECT COUNT(*) FROM songs")
        res = cursor.fetchone()[0]
        cursor.close()
        return res

    def __del__(self):
        self.mysql.connection.close()