#include "song.h"

Song::Song(int id, std::string name, char* image, int artist_id, int album_id)
{
	this->id = id;
	this->name = name;
	this->image = image;
	this->artist_id = artist_id;
	this->album_id = album_id;
}

int Song::get_id()
{
	return id;
}

std::string Song::get_name()
{
	return name;
}

char* Song::get_image()
{
	return image;
}

int Song::get_artist_id()
{
	return artist_id;
}

int Song::get_album_id()
{
	return album_id;
}