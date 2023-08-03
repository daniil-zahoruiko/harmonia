#include "DBConnection.h"

DBConnection::DBConnection(std::string &dbName, std::string &hostName, std::string &userName, std::string &password)
{
	driver = get_driver_instance();

	con = driver->connect(hostName, userName, password);

	con->setSchema(dbName);
}

void DBConnection::insert_song(std::istream& data, std::string &name)
{
	sql::PreparedStatement* prep_stmt;

	prep_stmt = con->prepareStatement("INSERT INTO songs (id, name, data, duration) VALUES(?, ?, ?, ?)");

	prep_stmt->setInt(1, get_table_length("songs") + 1);
	prep_stmt->setString(2, name);
	prep_stmt->setBlob(3, &data);
	prep_stmt->setInt(4, 0); // TODO: get song duration

	prep_stmt->execute();

	delete prep_stmt;
}

int DBConnection::read_song(char buf[], std::string name)
{
	delete[] buf;
	sql::PreparedStatement* prep_stmt;
	sql::ResultSet* res;

	prep_stmt = con->prepareStatement("SELECT data FROM songs WHERE name = \"" + name + "\"");

	res = prep_stmt->executeQuery();
	res->next();
	std::istream* is = res->getBlob("data");

	is->seekg(0, std::ios_base::end);
	int len = is->tellg();
	is->seekg(0, std::ios_base::beg);

	buf = new char[len + 200];
	is->read(buf, len + 200);

	return len;
}

int DBConnection::get_table_length(std::string table_name)
{
	sql::Statement* stmt = con->createStatement();

	std::string query = "SELECT COUNT(*) FROM " + table_name;

	sql::ResultSet *res = stmt->executeQuery(query);
	res->next();

	int length = res->getInt(1);

	delete stmt;
	delete res;

	return length;
}

DBConnection::~DBConnection()
{
	delete con;
}