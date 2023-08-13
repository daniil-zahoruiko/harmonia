#include <string>

#ifndef _SONG_H_
#define _SONG_H_
class Song
{
public:
	Song(int id, std::string name, char* image, int artist_id, int album_id);

	int get_id();
	std::string get_name();
	char* get_image();
	int get_artist_id();
	int get_album_id();

private:
	int id;
	std::string name;
	char* image;

	int artist_id;

	int album_id;
};
#endif