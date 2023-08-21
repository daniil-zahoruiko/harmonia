import mysql.connector
import os
import helpers
from song import Song
from artist import Artist

class DBConnection:
    def __init__(self, user, password, host, database):
        self.conn = mysql.connector.connect(user=user, password = password, host=host, database=database)
        self.cursor = self.conn.cursor()

    def get_all_songs_query(self):
        query = "SELECT id, name, artistId, albumId FROM songs"

        self.cursor.execute(query)

        res = []

        for (id, name, artist_id, album_id) in self.cursor:
            res.append(Song(id, name, artist_id, album_id))
        
        return res
    
    def read_image_file(self, id):
        dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), "images")
        dir = os.path.join(dir, id + ".webp")

        if(not os.path.isfile(dir)):
            query = f"SELECT image FROM songs WHERE id = {id}"

            self.cursor.execute(query)

            file = self.cursor.fetchone()[0]
        
            helpers.write_file(file, dir)

        return "./images/" + id + ".webp"
        
    def read_song_file(self, id):
        dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), "songs")
        dir = os.path.join(dir, id + ".mp3")

        if(not os.path.isfile(dir)):
            query = f"SELECT data FROM songs WHERE id = {id}"

            self.cursor.execute(query)

            file = self.cursor.fetchone()[0]
        
            helpers.write_file(file, dir)

        return "./songs/" + id + ".mp3"

    def write_song(self, name, data, artist_id, album_id):
        id = self.get_number_of_songs() + 1
        query = f"INSERT INTO songs(id, name, data, artistId, albumId) VALUES (%s, %s, %s, %s, %s)"

        args = (id, name, data, artist_id, album_id)

        self.cursor.execute(query, args)

        self.conn.commit()
    
    def add_image(self, id, data):
        query = "UPDATE songs SET image = %s WHERE id = %s"

        args = (data, id)

        self.cursor.execute(query, args)

        self.conn.commit()

    def get_artist_by_id(self, id):
        query = f"SELECT * FROM artists WHERE id = {id}"

        self.cursor.execute(query)
        (id, name) = self.cursor.fetchone()
        return Artist(id, name)

    def get_number_of_songs(self):
        self.cursor.execute("SELECT COUNT(*) FROM songs") 
        return self.cursor.fetchone()[0]

    def __del__(self):
        self.conn.close()