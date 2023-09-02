from flask import Flask, jsonify, send_file, request, Response
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt, get_jwt_identity, unset_jwt_cookies
from werkzeug.wsgi import FileWrapper
from datetime import datetime, timedelta, timezone
import json
import utils
import populate_db

# Initializing flask app
app = Flask(__name__)

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
    print("aaa")
    username = request.json["username"]
    password = request.json["password"]

    print(username, password)

    user_id = utils.try_get_user(connection, username)
    if user_id is None:
        print("invalid username")
        return jsonify({"msg": "Invalid username"}), 401

    user_data = utils.verify_user(connection, user_id, password)
    if(user_data is None):
        print("not authorized")
        return jsonify({"msg": "Invalid password"}), 401

    access_token = create_access_token(identity=user_id)

    print("aaa")

    return jsonify({"user_data": user_data, "token":access_token})

@app.route('/signup', methods=['POST'])
def sign_up():
    username = request.json["username"]
    password = request.json["password"]



    if(utils.try_get_user(connection, username) is not None):
        return jsonify({"msg": "User already exists"}), 401

    utils.create_user(connection, username, password)

    return "Success", 200

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

    res = {"user":{
        "songs":data,
        "playlists":["Playlist 1", "Playlist 2", "Playlist 3"]
    }}

    # Returning an api for showing in  reactjs
    return jsonify(res)

@app.route('/api/song/<id>')
@jwt_required()
def song(id):
    file = utils.get_song_file(connection, id)
    return file


@app.route("/api/artist/<id>/cover/")
#@jwt_required()
def song_image(id):
    file = utils.get_image_file(connection, id)
    return send_file(file)


# Running app
if __name__ == '__main__':
    app.run(debug=True)