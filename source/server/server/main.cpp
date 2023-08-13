#define _CRT_SECURE_NO_WARNINGS
#define _WINSOCK_DEPRECATED_NO_WARNINGS
#define NOMINMAX

#include "DBConnection.h"
#include "DataBuf.h"
#include "SocketConnection.h"

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

std::string to_lowercase(std::string s)
{
	for (int i = 0; i < s.size(); i++)
		s[i] = tolower(s[i]);

	return s;
}

DBConnection connect()
{
	std::string user, password, db, host;
	std::cout << "Enter your hostname or default to use default: ";
	std::cin >> host;

	if (to_lowercase(host) == "default")
		host = DEFAULT_DB_HOST;

	std::cout << "Enter your MySQL instance username: ";
	std::cin >> user;
	std::cout << "Password: ";
	std::cin >> password;
	std::cout << "Enter your schema name: ";
	std::cin >> db;

	return DBConnection(db, host, user, password);
}

void populate(DBConnection &connection)
{
	// TODO: implement song class

	while (true)
	{
		std::cout << "Enter path to the song or enter \"exit\" to stop: ";
		std::string input;
		std::cin >> input;

		if (to_lowercase(input) == "exit")
			return;

		// move this all to the song class
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

		std::cout << input.find_last_of('.') << ' ' << name << '\n';

		connection.insert_song(stream, name);
	}
}

int main()
{
	DBConnection db_connection = connect();

	std::cout << "If you want to populate the database before starting the server, enter \"populate\", otherwise enter \"skip\": ";
	std::string command;
	std::cin >> command;
	
	if (to_lowercase(command) == "populate")
		populate(db_connection);

	SocketConnection socket_connection(HOST, PORT);

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
				std::string name = db_connection.get_song_name(i);
				socket_connection.sendInt(i);
				socket_connection.sendString(name);

			}
		}
		else if (strcmp(buf, "getSong") == 0)
		{
			strcpy(buf, "Command processed");
			socket_connection.sendMessage(buf, strlen(buf));
			len = 4096;
			len = socket_connection.receiveMessage(buf, len);
			int id = atoi(buf);

			char* song_data = new char[4096];
			len = db_connection.read_song(song_data, id);

			std::cout << "Read " << len << " bytes from the db, sending them to client\n";

			socket_connection.sendInt(len);

			int curr = 0, step = 4096;
			while (curr < len)
			{
				step = std::min(step, len - curr);
				socket_connection.sendMessage(song_data + curr, step);
				curr += step;
			}
		}


		socket_connection.shutdownClient();
	}

	/*
	std::cout << "Sending a test song\n";

	char *song_data = new char[4096]; // for now, doesn't matter what size of the buffer is
	len = db_connection.read_song(song_data, "song");

	std::cout << "Read " << len << " bytes from the db, sending them to client\n";

	char* len_str = new char[20];
	len_str = _itoa(len, len_str, 10);

	socket_connection.sendMessage(len_str, strlen(len_str));

	int curr = 0, step = 4096;
	while (curr < len)
	{
		step = std::min(step, len - curr);
		socket_connection.sendMessage(song_data + curr, step); 
		curr += step;
	}
	
	socket_connection.shutdownClient();
	*/

	return EXIT_SUCCESS;
}