# Import flask and datetime module for showing date and time
from flask import Flask, jsonify, send_file
import datetime
import utils

x = datetime.datetime.now()

db_connection = utils.establish_db_connection()

# Initializing flask app
app = Flask(__name__)

data ={
    "user":{
        "songs":utils.get_all_songs(db_connection),
        "playlists":["Playlist 1", "Playlist 2", "Playlist 3"]
    }
}

print(data)

songs_files = [song["file"] for song in data["user"]["songs"]]
songs_ids = [song["id"] for song in data["user"]["songs"]]

print(songs_ids)

# Planned api routes: /api/artist/album/song/song.mp3
# Planned api routes: /api/artist/info/.json
# Planned api routes: /api/artist/album/info/.json
# Planned api routes: /api/artist/album/song/info/.json
# Planned api routes: /api/artist/album/song/song.mp3
# Planned api routes: /api/users/user_id/info/.json (?security)


# Route for seeing a data
@app.route('/api')
def get_time():

    # Returning an api for showing in  reactjs
    return jsonify(data)

@app.route('/api/song/<id>')
def song(id):
    if id not in songs_ids:
        return "No such song"
    else:
        return send_file(utils.get_song_file(db_connection, id))


@app.route("/api/artist/<id>/cover/")
def song_image(id):
    if id not in songs_ids:
        return "No such song"
    else:
        return send_file(utils.get_image_file(db_connection, id))


# Running app
if __name__ == '__main__': 
    app.run(debug=True)