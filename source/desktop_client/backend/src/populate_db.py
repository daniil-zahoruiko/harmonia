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

            db_connection.create_song(file[:-4], random.choice(genres_samples), file_data, 1, 1)