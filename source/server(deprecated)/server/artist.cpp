#include "artist.h"

Artist::Artist(int id, std::string name)
{
	this->id = id;
	this->name = name;
}

int Artist::get_id()
{
	return id;
}

std::string Artist::get_name()
{
	return name;
}