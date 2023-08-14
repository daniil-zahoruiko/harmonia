import socket
import os

HOST = "127.0.0.1"
PORT = 6881

def send_server_command(command, s):
    s.send(command)

def receive_int(s, n):
    return int(s.recv(n).decode('utf-8'))

def receive_str(s, n):
    return str(s.recv(n).decode('utf-8'))

def get_all_songs():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((HOST, PORT))
        s.send(b"Test message")
        data = s.recv(1024)
        print("Received: ", data)
    
        send_server_command(b"getAll", s)

        num_of_songs = receive_int(s, 20)
        data = []
        for i in range(num_of_songs):
            id = receive_int(s, 20)
            name = receive_str(s, 1024)
            artist_name = receive_str(s, 1024)
            data.append({"id":str(id), "title":name, "file":str(id) + ".mp3", "cover":"test1.webp", "artist":artist_name})

        return data
    
def get_song_data(id):
    dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), "songs")
    dir = os.path.join(dir, id + ".mp3")
    if not os.path.isfile(dir):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.connect((HOST, PORT))
            s.send(b"Test message")
            data = s.recv(1024)
            print("Received: ", data)

            send_server_command(b"getSong", s)

            data = receive_str(s, 128)

            s.send(str(id).encode())

            song_data_len = receive_int(s, 20)

            step = 4096
            curr = 0
        
            with open(dir, 'ab+') as f:
                while curr < song_data_len:
                    song_data = s.recv(step)
                    curr += step
                    f.write(song_data)
    else:
        print("File already exists")