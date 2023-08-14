#include "song.h"

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

	void insert_song(std::istream& data, Song song);
	int read_song(char *&buf, int id);
	std::string get_song_name(int id);

	int get_table_length(std::string table_name);

	~DBConnection();

private:
	

	sql::Driver* driver;
	sql::Connection* con;
};
#endif