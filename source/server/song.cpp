#include "song.h"
#include <Windows.h>
#include <mmsystem.h>
#include <filesystem>

#pragma comment(lib, "winmm.lib")

namespace fs = filesystem;

Song::Song(string name)
{
    song_name = name;
    current_playtime = 0;
}

void Song::play(void)
{
    fs::path dir = fs::current_path();
    dir = dir.parent_path().parent_path();
    
    dir /= song_name;

    string command_open = "open \"" + dir.string() + "\" type mpegvideo alias" + song_name;

    mciSendString(comman_open.c_str(), NULL, 0, 0);

    string command_play = "play " + song_name;

    mciSendString(command_play.c_str(), NULL, 0, 0);
}

void Song::pause(void)
{

}

void Song::reset(void)
{
    current_playtime = 0;

    string command_close = "close " + song_name;

    mciSendString(command_close.c_str(), NULL, 0, 0);

    PlaySound(NULL, 0, 0);
}