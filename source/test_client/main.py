import socket

HOST = "127.0.0.1"
PORT = 6881

def main():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((HOST, PORT))
        s.sendall(b"Test message")
        data = s.recv(1024)
        print("Received: ", data)
        song_data = s.recv(4000000)
        print(type(song_data))
        print("Received: ", song_data)

if(__name__ == "__main__"):
    main()