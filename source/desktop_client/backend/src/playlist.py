import json

class Playlist:
    def __init__(self, id, name, description, songs):
        self.id = id
        self.name = name
        self.description = description
        self.songs = songs

    def get_id(self):
        return self.id
    
    def get_name(self):
        return self.name
    
    def get_description(self):
        return self.description
    
    def get_songs(self):
        return json.loads(self.songs)
    
    def get_data(self):
        return {
            "id": self.get_id(),
            "name": self.get_name(),
            "description": self.get_description(),
            "songs": self.get_songs()
        }