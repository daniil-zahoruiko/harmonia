from db_connection import DBConnection
import helpers
import json

def establish_db_connection(app):
    return DBConnection(app)

def try_get_user(db, username):
    return db.get_user_id_by_username(username)

def try_get_user_by_email(db,email):
    return db.get_user_id_by_email(email)

def verify_user(db, user_id, input_password):
    user = db.get_user_by_id(user_id)

    return user.get_user_data() if user.verify_password(input_password) else None

def get_user(db,user_id):
    user = db.get_user_by_id(user_id)
    return user.get_user_data()

def create_user(db, username, password,email,full_name):
    db.create_user(username, password,email,full_name)

def get_all_songs(db):
    songs = db.get_all_songs_query()

    data =[{"id":str(song.get_id()),
            "title":song.get_name(),
            "genre": song.get_genre(),
            "file":f"{song.get_id()}.mp3",
            "cover":f"{song.get_id()}.webp",
            "artist":db.get_artist_by_id(song.get_artist_id()).get_name(),
            "album":db.get_album_by_id(song.get_album_id()).get_name(),
            "artistId":str(song.get_artist_id()),
            "albumId":str(song.get_album_id()),
            "length":song.get_length(),
            "streams":song.get_streams()} for song in songs]

    return data

def get_all_artists(db):
    artists = db.get_all_artists_query()

    data = [{
        "id":str(artist.get_id()),
        "name":artist.get_name()
    } for artist in artists]

    return data

def get_all_albums(db):
    albums = db.get_all_albums_query()

    data = [{
        "id":album.get_id(),
        "name":album.get_name(),
        "artist":db.get_artist_by_id(album.get_artist_id()).get_name(),
        "artistId":album.get_artist_id()
    } for album in albums]

    return data

def get_user_playlists(db, user_id):
    playlists = db.get_playlists_by_user_id(user_id)

    return [playlist.get_data() for playlist in playlists]

def update_playlist_songs(db, id, songs):
    db.update_playlist_songs(id,json.dumps(songs))

def update_playlist_name(db, id, name):
    db.update_playlist_name(id,name)

def update_playlist_description(db, id, description):
    db.update_playlist_description(id,description)

def upload_playlist_image(db,id,image):
    image_bytes = helpers.read_file_bytes(image)
    db.update_playlist_image(id,image_bytes)

def add_playlist(db,user_id,name):
    db.create_playlist(user_id,name)

def get_playlist(db,id):
    db.get_playlist_by_id(id)

def like_song(db,liked_songs,user_id):
    db.update_liked_songs(json.dumps(liked_songs),user_id)

def add_favorite_artist(db,fav_artists,user_id):
    db.update_favorite_artists(json.dumps(fav_artists),user_id)

def add_streams(db,song_id):
    db.update_streams(song_id)

def get_song_file(db, id):
    return db.read_song_file(id)

def get_image_file(db, id, table):
    return db.read_image_file(id, table)

def change_username(db,user_id,username):
    return db.update_username(user_id,username)

def change_email(db,user_id,email):
    return db.update_email(user_id,email)

def change_password(db,user_id,password):
    return db.update_password(user_id,password)

def change_settings(db,user_id,settings):
    db.update_settings(user_id,json.dumps(settings))

def change_full_name(db,user_id,full_name):
    return db.update_full_name(user_id,full_name)

def create_artist(db,name,image,user_id):
    image_bytes = helpers.read_file_bytes(image)
    id = db.create_artist(name,image_bytes,user_id)
    return id

def create_song(db,title,genre,audio,artist_id,album_id):
    audio_bytes = helpers.read_file_bytes(audio)

    song = db.create_song(title,genre,audio_bytes,artist_id,album_id)
    return {"id":str(song.get_id()),
            "title":song.get_name(),
            "genre": song.get_genre(),
            "file":f"{song.get_id()}.mp3",
            "cover":f"{song.get_id()}.webp",
            "artist":db.get_artist_by_id(song.get_artist_id()).get_name(),
            "album":db.get_album_by_id(song.get_album_id()).get_name(),
            "artistId":str(song.get_artist_id()),
            "albumId":str(song.get_album_id()),
            "length":song.get_length(),
            "streams":song.get_streams()}

def create_album(db,name,artist_id,image):
    image_bytes = helpers.read_file_bytes(image)
    id = db.create_album(name,artist_id,image_bytes)
    return id

def delete_playlist(db,id):
    db.remove_playlist(id)
