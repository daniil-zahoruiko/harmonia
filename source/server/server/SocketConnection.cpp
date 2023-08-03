#define _WINSOCK_DEPRECATED_NO_WARNINGS

#include "SocketConnection.h"
#include <stdio.h>
#include <ws2tcpip.h>
#include <stdlib.h>
#include <Windows.h>
#include <iostream>

SocketConnection::SocketConnection(const char host[], const char port[])
{
	ListenSocket = INVALID_SOCKET;
	ClientSocket = INVALID_SOCKET;

	DllVersion = MAKEWORD(2, 2);

	if (WSAStartup(DllVersion, &wsaData) != 0)
		ExitProcess(EXIT_FAILURE);

	addrinfo hints;
	ZeroMemory(&hints, sizeof(hints));

	hints.ai_family = AF_INET;
	hints.ai_socktype = SOCK_STREAM;
	hints.ai_protocol = 0;

	int iResult = getaddrinfo(host, port, &hints, &addr);
	if (iResult != 0)
		ExitProcess(EXIT_FAILURE);

	ListenSocket = socket(addr->ai_family, addr->ai_socktype, addr->ai_protocol);
	if (ListenSocket == INVALID_SOCKET)
		ExitProcess(EXIT_FAILURE);

	iResult = bind(ListenSocket, addr->ai_addr, (int)addr->ai_addrlen);
	if (iResult == SOCKET_ERROR)
		ExitProcess(EXIT_FAILURE);

	ClientInfo = { 0 };
}

void SocketConnection::awaitClientConnection()
{
	std::cout << "Waiting for client...\n";

	int iResult = listen(ListenSocket, SOMAXCONN);
	if (iResult == SOCKET_ERROR)
		ExitProcess(EXIT_FAILURE);
		
	int addrsize = sizeof(ClientInfo);

	ClientSocket = accept(ListenSocket, (struct sockaddr*) &ClientInfo, &addrsize);
	if (ClientSocket == INVALID_SOCKET)
		ExitProcess(EXIT_FAILURE);

	//closesocket(ListenSocket);

	std::cout << "Client connected on " << inet_ntoa(ClientInfo.sin_addr) << ":" << ClientInfo.sin_port << '\n';
}

int SocketConnection::receiveMessage(char buf[], int len)
{
	int iResult = recv(ClientSocket, buf, len, 0);

	if (iResult > 0)
	{
		std::cout << "Received " << iResult << " bytes\n";
		buf[iResult] = '\0';
	}
	else if (iResult == 0)
		std::cout << "Connection closing...\n";
	else
	{
		std::cout << "Receive failed\n";
		closesocket(ClientSocket);
		WSACleanup();
	}

	return iResult;
}

void SocketConnection::sendMessage(char buf[], int len)
{
	int iResult = send(ClientSocket, buf, len, 0);

	if (iResult == SOCKET_ERROR)
	{
		std::cout << "Sending failed\n";
		closesocket(ClientSocket);
		WSACleanup();
	}
}

void SocketConnection::shutdownClient()
{
	int iResult = shutdown(ClientSocket, SD_SEND);
	if (iResult == SOCKET_ERROR) {
		std::cout << "Shutdown failed\n";
		closesocket(ClientSocket);
		WSACleanup();
	}
}

SocketConnection::~SocketConnection()
{
	WSACleanup();
	closesocket(ListenSocket);
	closesocket(ClientSocket);
}