#include <Winsock2.h>

#pragma comment(lib, "Ws2_32.lib")

class SocketConnection
{
public:
	SocketConnection(const char host[], const char port[]);

	void awaitClientConnection();
	
	int receiveMessage(char buf[], int len);

	void sendMessage(char buf[], int len);

	void shutdownClient();

	~SocketConnection();

//private:
	WSAData wsaData;
	WORD DllVersion;
	addrinfo* addr;
	sockaddr_in ClientInfo;
	SOCKET ListenSocket, ClientSocket;
};