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

		connection.insert_song(stream, input);
	}
}

int main()
{
	/*DBConnection db_connection = connect();

	std::cout << "If you want to populate the database before starting the server, enter \"populate\", otherwise press enter: ";
	std::string command;
	std::cin >> command;
	
	if (to_lowercase(command) == "populate")
		populate(db_connection);*/

	SocketConnection socket_connection(HOST, PORT);

	socket_connection.awaitClientConnection();

	// get and send back a test message to check connection
	char buf[4096];
	int len = 4096;
	len = socket_connection.receiveMessage(buf, len);

	std::cout << "Received: " << buf << '\n';

	socket_connection.sendMessage(buf, len);
 
	socket_connection.shutdownClient();

	return EXIT_SUCCESS;
}