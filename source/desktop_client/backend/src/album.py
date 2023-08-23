class Album:
    def __init__(self, id, name, artist_id):
        self.id = id
        self.name = name
        self.artist_id = artist_id

    def get_name(self):
        return self.name
