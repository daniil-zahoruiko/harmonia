#define _CRT_SECURE_NO_WARNINGS
#define _WINSOCK_DEPRECATED_NO_WARNINGS
#define NOMINMAX

#include "DBConnection.h"
#include "DataBuf.h"
#include "SocketConnection.h"
#include "song.h"

#include <cerrno>
#include <cstring>
#include <iostream>
#include <fstream>
#include <string>
#include <limits>
#include <algorithm>

#define HOST "127.0.0.1"
#define PORT "6881"

const std::string DEFAULT_DB_HOST = "tcp://127.0.0.1:3306";
const std::string DEFAULT_DB_USER = "root";
const std::string DEFAULT_DB_PASSWORD = "1234";
const std::string DEFAULT_DB_SCHEMA = "main";

std::string to_lowercase(std::string s)
{
	for (int i = 0; i < s.size(); i++)
		s[i] = tolower(s[i]);

	return s;
}

DBConnection connect()
{
	std::string user = DEFAULT_DB_USER, password = DEFAULT_DB_PASSWORD, db = DEFAULT_DB_SCHEMA, host = DEFAULT_DB_HOST;

	return DBConnection(db, host, user, password);
}

void populate(DBConnection &connection)
{
	while (true)
	{
		std::cout << "Enter path to the song or enter \"exit\" to stop: ";
		std::string input;
		getline(std::cin, input);

		if (to_lowercase(input) == "exit")
			return;

		std::ifstream file(input, std::ios::binary);
		
		if (!file)
		{
			std::cout << "Could not open the file " << input << '\n';
			continue;
		}

		// calculate file length
		file.ignore(std::numeric_limits<std::streamsize>::max());
		std::streamsize length = file.gcount();
		file.clear();
		file.seekg(0, std::ios_base::beg);

		char* buf = new char[length];

		size_t binary_size = 0;

		std::cout << "Reading " << input << '\n';

		file.read(buf, length + 200);
		binary_size += file.gcount();
		
		std::cout << "Read " << binary_size << " bytes\n";

		DataBuf databuf(buf, binary_size);
		std::istream stream(&databuf);

		int start_pos = input.find_last_of('\\') + 1;
		std::string name = input.substr(start_pos, input.find_last_of('.') - start_pos);

		// TEMPORARY PLACEHOLDERS
		char* image = nullptr;
		int img_len = 0;
		int artist_id = 1;
		int album_id = 1;

		Song song(connection.get_table_length("songs") + 1, name, image, img_len, artist_id, album_id);

		connection.insert_song(stream, song);

		delete[] buf;
	}
}

int main()
{
	DBConnection db_connection = connect();

	std::cout << "If you want to populate the database before starting the server, enter \"populate\", otherwise press enter: ";
	std::string command;
	getline(std::cin, command);
	
	if (to_lowercase(command) == "populate")
		populate(db_connection);

	SocketConnection socket_connection(HOST, PORT);

	// TODO: support multiple connections using multithreads
	while (true)
	{
		socket_connection.awaitClientConnection();

		// get and send back a test message to check connection
		char buf[4096];
		int len = 4096;
		len = socket_connection.receiveMessage(buf, len);

		std::cout << "Received: " << buf << '\n';

		socket_connection.sendMessage(buf, len);
		
		len = 4096;
		len = socket_connection.receiveMessage(buf, len);

		std::cout << buf << '\n';

		if (strcmp(buf, "getAll") == 0)
		{
			int table_len = db_connection.get_table_length("songs");
			socket_connection.sendInt(table_len);

			for (int i = 1; i <= table_len; i++)
			{
				Song song = db_connection.get_song(i);
				socket_connection.sendInt(i);
				socket_connection.sendString(song.get_name());
				socket_connection.sendString(db_connection.get_artist(song.get_artist_id()).get_name());

			}
		}
		else if (strcmp(buf, "getSong") == 0)
		{
			strcpy(buf, "Command processed");
			socket_connection.sendMessage(buf, strlen(buf));
			len = 4096;
			len = socket_connection.receiveMessage(buf, len);
			int id = atoi(buf);

			char* song_data = nullptr;
			len = db_connection.get_song_binary(song_data, id);

			std::cout << "Read " << len << " bytes from the db, sending them to client\n";

			socket_connection.sendInt(len);

			int curr = 0, step = 4096;
			while (curr < len)
			{
				step = std::min(step, len - curr);
				socket_connection.sendMessage(song_data + curr, step);
				curr += step;
			}

			delete[] song_data;
		}


		socket_connection.shutdownClient();
	}

	return EXIT_SUCCESS;
}