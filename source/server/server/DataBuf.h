#include <fstream>

class DataBuf : public std::streambuf
{
public:
	DataBuf(char* d, size_t s);
};