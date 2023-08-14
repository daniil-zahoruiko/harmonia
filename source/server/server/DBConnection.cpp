#include "DBConnection.h"

int istream_to_cstr(std::istream* is, char *&buf)
{
	if(buf != nullptr)
		delete[] buf;

	is->seekg(0, std::ios_base::end);
	int len = is->tellg();
	is->seekg(0, std::ios_base::beg);

	buf = new char[len];
	is->read(buf, len);

	return len;
}

DBConnection::DBConnection(std::string &dbName, std::string &hostName, std::string &userName, std::string &password)
{
	driver = get_driver_instance();

	con = driver->connect(hostName, userName, password);

	con->setSchema(dbName);
}

void DBConnection::insert_song(std::istream& data, Song song)
{
	sql::PreparedStatement* prep_stmt;

	// TODO: Add images, also not forget to update the schema to not null for images
	prep_stmt = con->prepareStatement("INSERT INTO songs(id, name, data, artistId, albumId) VALUES (?, ?, ?, ?, ?)");

	prep_stmt->setInt(1, song.get_id());
	prep_stmt->setString(2, song.get_name());
	prep_stmt->setBlob(3, &data);
	prep_stmt->setInt(4, song.get_artist_id());
	prep_stmt->setInt(5, song.get_album_id());

	prep_stmt->execute();

	delete prep_stmt;
}

int DBConnection::get_song_binary(char *&buf, int id)
{
	sql::PreparedStatement* prep_stmt;
	sql::ResultSet* res;

	prep_stmt = con->prepareStatement("SELECT data FROM songs WHERE id = \"" + std::to_string(id) + "\"");

	res = prep_stmt->executeQuery();
	res->next();
	std::istream* is = res->getBlob("data");

	delete res;
	delete prep_stmt;

	return istream_to_cstr(is, buf);
}

Song DBConnection::get_song(int id)
{
	sql::PreparedStatement* prep_stmt;
	sql::ResultSet* res;
	prep_stmt = con->prepareStatement("SELECT * FROM songs WHERE id = \"" + std::to_string(id) + "\"");

	res = prep_stmt->executeQuery();
	res->next();

	char* image = nullptr;
	int img_len = istream_to_cstr(res->getBlob("image"), image);
	Song res_song(id, res->getString("name"), image, img_len, res->getInt("artistId"), res->getInt("albumId"));

	delete res;
	delete prep_stmt;

	return res_song;
}

Artist DBConnection::get_artist(int id)
{
	sql::PreparedStatement* prep_stmt;
	sql::ResultSet* res;
	prep_stmt = con->prepareStatement("SELECT * FROM artists WHERE id = \"" + std::to_string(id) + "\"");

	res = prep_stmt->executeQuery();
	res->next();

	Artist res_artist(id, res->getString("name"));

	delete prep_stmt;
	delete res;

	return res_artist;
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