#ifndef _SONG_H_
#define _SONG_H_

#include <string>

using namespace std;

class Song{
public:
    Song(string name);

    void play(void);
    void pause(void);
    void reset(void);

private:

    string song_name;
    int duration, current_playtime;

};

#endif _SONG_H_