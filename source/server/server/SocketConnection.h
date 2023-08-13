#include <Winsock2.h>
#include <string>

#pragma comment(lib, "Ws2_32.lib")

#ifndef _SOCKET_CONNECTION_H_
#define _SOCKET_CONNECTION_H_
class SocketConnection
{
public:
	SocketConnection(const char host[], const char port[]);

	void awaitClientConnection();
	
	int receiveMessage(char buf[], int len);

	void sendMessage(char buf[], int len);
	void sendInt(int n);
	void sendString(std::string s);

	void shutdownClient();

	~SocketConnection();

//private:
	WSAData wsaData;
	WORD DllVersion;
	addrinfo* addr;
	sockaddr_in ClientInfo;
	SOCKET ListenSocket, ClientSocket;
};
#endif