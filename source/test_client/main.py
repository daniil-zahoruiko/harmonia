import socket

HOST = "127.0.0.1"
PORT = 6881


def main():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((HOST, PORT))
        s.sendall(b"Test message")
        data = s.recv(1024)
        print("Received: ", data)
        
        song_data_len = int(s.recv(20).decode('utf-8'))
        print(f"Song data size is {song_data_len}")
        step = 4096
        curr = 0
        with open("res_song.mp3", 'ab+') as f:
            while curr < song_data_len:
                song_data = s.recv(step)
                curr += step
                f.write(song_data)
if(__name__ == "__main__"):
    main()