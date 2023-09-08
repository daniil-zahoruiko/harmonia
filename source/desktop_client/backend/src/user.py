import bcrypt
import json

class User:
    def __init__(self, id, username, password, email, full_name,liked_songs,fav_artists,settings,artistId):
        self.id = id
        self.username = username
        self.password = password
        self.email = email
        self.full_name = full_name
        self.liked_songs = liked_songs
        self.fav_artists = fav_artists
        self.settings = settings
        self.artistId = artistId

    def verify_password(self, plain_password):
        return bcrypt.checkpw(plain_password.encode('utf-8'), self.password.encode('utf-8'))
    
    def get_user_data(self):
        return {"id": str(self.id),
                "username": self.username,
                "password": self.password,
                "email": self.email,
                "full_name": self.full_name,
                "liked_songs":json.loads(self.liked_songs),
                "fav_artists":json.loads(self.fav_artists),
                "settings":json.loads(self.settings),
                "artistId":self.artistId}