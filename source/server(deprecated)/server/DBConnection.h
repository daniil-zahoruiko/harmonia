#include "song.h"
#include "artist.h"

#include <cppconn/driver.h>
#include <cppconn/exception.h>
#include <cppconn/resultset.h>
#include <cppconn/statement.h>
#include <cppconn/prepared_statement.h>

#include <string>
#include <fstream>

#ifndef _DBCONNECTION_H_
#define _DBCONNECTION_H_
class DBConnection
{
public:

	DBConnection(std::string &dbName, std::string &hostName, std::string &userName, std::string &password);

	void insert_song(std::istream*& data, Song song);
	int get_song_binary(char *&buf, int id);
	Song get_song(int id);

	Artist get_artist(int id);

	int get_table_length(std::string table_name);

	void populate();

	~DBConnection();

private:
	

	sql::Driver* driver;
	sql::Connection* con;
};
#endif