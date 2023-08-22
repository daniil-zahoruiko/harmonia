from flask import Flask, jsonify, send_file
import utils
import populate_db

# Initializing flask app
app = Flask(__name__)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '1234'
app.config['MYSQL_DB'] = 'main'

connection = utils.establish_db_connection(app)

# populating data to the db
@app.route('/populate')
def populate():
    populate_db.run(connection)
    return("Populated succesfully")

# Route for seeing a data
@app.route('/api')
def data():
    data = utils.get_all_songs(connection)

    res = {"user":{
        "songs":data,
        "playlists":["Playlist 1", "Playlist 2", "Playlist 3"]
    }}

    # Returning an api for showing in  reactjs
    return jsonify(res)

@app.route('/api/song/<id>')
def song(id):
    file = utils.get_song_file(connection, id)
    return send_file(file)


@app.route("/api/artist/<id>/cover/")
def song_image(id):
    file = utils.get_image_file(connection, id)
    return send_file(file)


# Running app
if __name__ == '__main__':
    app.run(debug=True)