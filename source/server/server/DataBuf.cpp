#include "DataBuf.h"

DataBuf::DataBuf(char* d, size_t s)
{
	setg(d, d, d + s);
}