#include <cppconn/driver.h>
#include <cppconn/exception.h>
#include <cppconn/resultset.h>
#include <cppconn/statement.h>
#include <cppconn/prepared_statement.h>

#include <string>
#include <fstream>

class DBConnection
{
public:

	DBConnection(std::string &dbName, std::string &hostName, std::string &userName, std::string &password);

	void insert_song(std::istream& data, std::string &name);
	int read_song(char *&buf, int id);
	std::string get_song_name(int id);

	int get_table_length(std::string table_name);

	~DBConnection();

private:
	

	sql::Driver* driver;
	sql::Connection* con;
};