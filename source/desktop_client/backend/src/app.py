# Import flask and datetime module for showing date and time
from flask import Flask, jsonify, send_file
import datetime
import server_connection as srv

x = datetime.datetime.now()

# Initializing flask app
app = Flask(__name__)


data ={
    "user":{
        "songs":srv.get_all_songs(),
        "playlists":["Playlist 1", "Playlist 2", "Playlist 3"]
    }
}

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
        srv.get_song_data(id)
        return send_file("./songs/" + id + ".mp3")


@app.route("/api/artist/<song>/cover/")
def song_image(song):
    if song not in songs_ids:
        return "No such song"
    else:
        for i in data["user"]["songs"]:
            if i["id"] == song:
                return send_file("./images/"+i["cover"])


# Running app
if __name__ == '__main__': 
    app.run(debug=True)