from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt, get_jwt_identity, unset_jwt_cookies
from flask_cors import CORS, cross_origin
from datetime import datetime, timedelta, timezone
import json
import utils
import populate_db
import helpers

# Initializing flask app
app = Flask(__name__)
cors = CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '1234'
app.config['MYSQL_DB'] = 'main'

connection = utils.establish_db_connection(app)

app.config['JWT_SECRET_KEY'] = "some-secret key" # remember to change the key
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
jwt = JWTManager(app)

@app.route('/token', methods=['POST'])
def create_token():
    username = request.json["username"]
    password = request.json["password"]

    error_msg = "Invalid username or password"

    user_id = utils.try_get_user(connection, username)
    if user_id is None:
        print("invalid username")
        return jsonify({"msg": error_msg}), 401

    user_data = utils.verify_user(connection, user_id, password)
    if(user_data is None):
        print("not authorized")
        return jsonify({"msg": error_msg}), 401

    access_token = create_access_token(identity=user_id)

    return jsonify({"token":access_token})

@app.route('/signup', methods=['POST'])
def sign_up():
    username = request.json["username"]
    password = request.json["password"]
    email = request.json["email"]
    full_name = request.json["full_name"]

    if(utils.try_get_user(connection, username) is not None):
        return jsonify({"msg": "Username already exists"}), 401
    if(utils.try_get_user_by_email(connection, email) is not None):
        return jsonify({"msg": "Email already exists"}), 401

    utils.create_user(connection, username, password,email,full_name)

    return jsonify({"msg": "Success"}), 200

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        return response

@app.route('/logout', methods=['POST'])
def log_out():
    utils.delete_cache("cache.txt")
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

# populating data to the db
@app.route('/populate')
def populate():
    populate_db.run(connection)
    return("Populated succesfully")

# Route for seeing a data
@app.route('/api')
@jwt_required()
def data():
    data = utils.get_all_songs(connection)
    artists = utils.get_all_artists(connection)
    albums = utils.get_all_albums(connection)

    user_id = get_jwt_identity()

    user_data = utils.get_user(connection,user_id)
    user_playlists = utils.get_user_playlists(connection, user_id)

    res = {
        "songs":data,
        "playlists":user_playlists,
        "user_data":user_data,
        "artists":artists,
        "albums":albums
    }

    # Returning an api for showing in  reactjs
    return jsonify(res)


@app.route('/api/song/<id>')
@jwt_required()
def song(id):
    file = utils.get_song_file(connection, id)
    return file


@app.route("/api/song/cover/<id>/")
@cross_origin()
@jwt_required()
def song_image(id):
    file = utils.get_image_file(connection, id, "songs")
    return file

@app.route("/api/artist/cover/<id>/")
@cross_origin()
@jwt_required()
def artist_image(id):
    file = utils.get_image_file(connection, id, "artists")
    return file

@app.route("/api/album/cover/<id>/")
@cross_origin()
@jwt_required()
def album_image(id):
    file = utils.get_image_file(connection, id, "albums")
    return file

@app.route("/api/playlist/cover/<id>/")
@cross_origin()
@jwt_required()
def playlist_image(id):
    file = utils.get_image_file(connection, id, "playlists")
    if file is None:
        return jsonify({"msg": "Playlist contains no image"}), 204
    return file

@app.route("/api/add_playlist",methods=["POST"])
@cross_origin()
@jwt_required()
def add_playlist():
    print(request)
    name = request.json["name"]

    user_id = get_jwt_identity()

    print(name,user_id)

    try:
        utils.add_playlist(connection,user_id,name)
        playlists = utils.get_user_playlists(connection, user_id)
    except:
        return jsonify({"msg": "Server error"}), 401
    return jsonify(playlists)


@app.route("/api/update_playlist",methods=["POST"])
@cross_origin()
@jwt_required()
def update_playlist():
    id = request.json["id"]
    name = request.json["name"]
    description = request.json["description"]
    data = request.json["data"]


    print(id,name,description,data)

    try:
        if name != data["name"]:
            utils.update_playlist_name(connection,id,data["name"])
        if description != data["description"]:
            utils.update_playlist_description(connection,id,data["description"])
    except:
        return jsonify({"msg": "Server Error"}), 401

    return jsonify({"msg": "Success"}), 200

@app.route("/add_playlist_song",methods=["POST"])
@cross_origin()
@jwt_required()
def update_playlist_songs():
    id = request.json["id"]
    songs = request.json["songs"]

    print(songs)

    try:
        utils.update_playlist_songs(connection,id,songs)
    except:
        return jsonify({"msg": "Server Error"}), 401
    return jsonify({"msg": "Success"}), 200


@app.route("/change_playlist_image/<id>",methods=["POST"])
@cross_origin()
@jwt_required()
def change_playlist_image(id):
    data = request.files["file"]

    image_bytes = helpers.read_file_bytes(data)

    try:
        utils.upload_playlist_image(connection,id,image_bytes)
    except:
        return jsonify({"msg": "Server Error"}), 401
    return jsonify({"msg": "Success"}), 200



@app.route("/api/like_song",methods=["POST"])
@cross_origin()
@jwt_required()
def update_liked_songs():
    username = request.json["username"]
    liked_songs = request.json["liked_songs"]

    print(username,liked_songs)

    user_id = get_jwt_identity()

    utils.like_song(connection, liked_songs,user_id)

    return jsonify({"msg": "Success"}), 200

@app.route("/api/fav_artist",methods=["POST"])
@cross_origin()
@jwt_required()
def update_favorite_artists():
    username = request.json["username"]
    fav_artists = request.json["fav_artists"]

    print(username,fav_artists)

    user_id = get_jwt_identity()

    utils.add_favorite_artist(connection, fav_artists,user_id)

    return jsonify({"msg": "Success"}), 200

@app.route("/api/change_data",methods=["POST"])
@cross_origin()
@jwt_required()
def change_data():
    username = request.json["username"]
    email = request.json["email"]
    fullName = request.json["full_name"]
    input = request.json["input"]

    user_id = get_jwt_identity()

    isTaken = utils.try_get_user(connection,input["username"])
    if isTaken is None:
        utils.change_username(connection,user_id,input["username"])
    elif username != input["username"]:
        return jsonify({"msg": "Mate. User with such username already exists"}), 401

    isTaken = utils.try_get_user_by_email(connection,input["email"])
    if isTaken is None:
        utils.change_email(connection,user_id,input["email"])
    elif email != input["email"]:
        return jsonify({"msg": "Buddy. This email is already taken"}), 401

    if input["password"] != "":
        utils.change_password(connection,user_id,input["password"])


    if fullName != input["fullName"]:
        utils.change_full_name(connection,user_id,input["fullName"])

    return jsonify({"msg": "Success"}), 200

@app.route("/api/add_streams",methods=["POST"])
@cross_origin()
@jwt_required()
def update_streams():
    id = request.json["id"]

    try:
        utils.add_streams(connection,id)
    except:
        return jsonify({"msg": "Server Error"}), 401
    return jsonify({"msg": "Success"}), 200

# Running app
if __name__ == '__main__':
    app.run(debug=True)