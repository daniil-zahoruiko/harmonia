# Import flask and datetime module for showing date and time
from flask import Flask, jsonify, send_file
import datetime

x = datetime.datetime.now()

# Initializing flask app
app = Flask(__name__)

data =[
        {
            "title":"Test 1",
            "file":"test1.mp3"
        },
        {
            "title":"Test 2",
            "file":"test2.mp3"
        },
        {
            "title":"Test 3",
            "file":"test3.mp3"
        }
    ]

songs = [song["file"] for song in data]

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

@app.route('/song/<name>')
def song(name):
    if name not in songs:
        return "No such song"
    else:
        return send_file("./"+name)

# Running app
if __name__ == '__main__':
    app.run(debug=True)