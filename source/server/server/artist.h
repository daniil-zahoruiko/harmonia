#include <string>

#ifndef _ARTIST_H_
#define _ARTIST_H_
class Artist
{
public:
	int get_id();
	std::string get_name();
	
	Artist(int id, std::string name);

private:
	int id;
	std::string name;
};
#endif