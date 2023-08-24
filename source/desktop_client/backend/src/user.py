import bcrypt

class User:
    def __init__(self, username, password, email, full_name, display_name):
        self.username = username
        self.password = password
        self.email = email
        self.full_name = full_name
        self.display_name = display_name

    def verify_password(self, plain_password):
        return bcrypt.checkpw(plain_password, self.password)
    
    def get_user_data(self):
        return {"username": self.username, "password": self.password, "email": self.email, "full name": self.full_name, "display name": self.display_name}