class Song:
    def __init__(self, id, name, genre, artist_id, album_id, length, streams):
        self.id = id
        self.name = name
        self.genre = genre
        self.artist_id = artist_id
        self.album_id = album_id
        self.length = length
        self.streams = streams

    def get_name(self):
        return self.name

    def get_id(self):
        return self.id

    def get_genre(self):
        return self.genre

    def get_artist_id(self):
        return self.artist_id

    def get_album_id(self):
        return self.album_id

    def get_length(self):
        return self.length

    def get_streams(self):
        return str(self.streams)