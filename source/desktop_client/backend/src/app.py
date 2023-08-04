# Import flask and datetime module for showing date and time
from flask import Flask, jsonify, send_file
import datetime

x = datetime.datetime.now()

# Initializing flask app
app = Flask(__name__)

data ={"user":{
    "songs":[{
                "title":"Test 1",
                "file":"test1.mp3",
                "artist":"Artist 1",
                "cover":"test1.webp",
                "id":"test_1"
            },
            {
                "title":"Test 2",
                "file":"test2.mp3",
                "artist":"Artist 2",
                "cover":"test2.webp",
                "id":"test_2"
            },
            {
                "title":"Test 3",
                "file":"test3.mp3",
                "artist":"Artist 3",
                "cover":"test3.jpg",
                "id":"test_3",
                "name":"Artist 3"
            },
            {
                "title":"Test 4",
                "file":"test1.mp3",
                "artist":"Artist 4",
                "cover":"test1.webp",
                "id":"test_4"
            }
            ],
    "playlists":["Playlist 1", "Playlist 2", "Playlist 3"]
    }
}


songs_files = [song["file"] for song in data["user"]["songs"]]
songs_ids = [song["id"] for song in data["user"]["songs"]]

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

@app.route('/api/song/<name>')
def song(name):
    if name not in songs_files:
        return "No such song"
    else:
        return send_file("./songs/"+name)


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