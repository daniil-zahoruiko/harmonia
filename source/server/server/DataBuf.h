#include <fstream>

#ifndef _DATABUF_H_
#define _DATABUF_H_
class DataBuf : public std::streambuf
{
public:
	DataBuf(char* d, size_t s);
};
#endif