from db_connection import DBConnection
import helpers
import os
import random


genres_samples = ["hip-hop","rock","rap","trap","classical","workout","jazz","indie","country"]

def run(connection):
    main(connection)

def main(db_connection):
    path = input("Enter path to song files: ")

    for file in os.listdir(path):
        dir = os.path.join(path, file)
        if os.path.isfile(dir) and file[-3:] == "mp3":
            with open(dir, 'rb') as f:
                file_data = f.read()

            db_connection.write_song(file[:-4], random.choice(genres_samples), file_data, 1, 1)

    path = input("Enter path to image files: ")

    quit = ""

    while quit != "quit":
        id = int(input("Enter song id: "))
        file = input("Enter image name: ")

        dir = os.path.join(path, file)

        ext = file[file.rfind('.') + 1:]

        valid_ext = ["jpg", "jpeg", "webp", "png"]

        if os.path.isfile(dir) and ext in valid_ext:
            with open(dir, 'rb') as f:
                file_data = f.read()

            db_connection.add_image(id, file_data)
        else:
            print("Invalid file")

        quit = input('To quit, enter "quit": ')