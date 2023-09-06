import bcrypt

class User:
    def __init__(self, id, username, password, email, full_name,favorites,settings,artistId):
        self.id = id
        self.username = username
        self.password = password
        self.email = email
        self.full_name = full_name
        self.favorites = favorites
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
                "favorites":self.favorites,
                "settings":self.settings,
                "artistId":self.artistId}