#include <iostream>
#include <signal.h>
#include "TCPClient.h"

#include <string>
#include <queue>
#include <mutex>
#include <stdlib.h>


TCPClient tcp;

void sig_exit(int s)
{
	tcp.exit();
	exit(0);
}

const std::string defaultClientId = "Defauld client ID";
std::queue <int> simulatedData;
std::mutex mtx;

string prepareMessageToServer(std::queue <int> &data, std::string const &clientId)
{
	time_t now;
	time(&now);

	std::string m = ctime(&now) + ',' + clientId + ",\"" + std::to_string( data.front() ) + "\"\n";

	mtx.lock();
	data.pop();
	mtx.unlock();

	return m;
}

int main(int argc, char *argv[])
{
	if(argc < 3) {
		cerr << "Usage syntax: " << argv[0] <<" server-ip port [client-id]" << endl;
		return 0;
	}
	signal(SIGINT, sig_exit);

	uint sendDataCounter = 0;
	uint recivedDataCounter = 0;

	const std::string clientId = (argc == 4) ? argv[3] : defaultClientId;
	bool tcpOk = tcp.setup(argv[1],atoi(argv[2]));
	cout << "Connection to server: " << ( (tcpOk) ? "OK" : "not OK" ) << endl;
	cout << "Query data" << '\t' << "Sent data" << '\t' << "Recived data" << endl;
	while(tcpOk)
	{
		/** wait data from buffer **/
		while (simulatedData.empty()) sleep(1);

		tcp.Send( prepareMessageToServer(simulatedData, clientId) );
		sendDataCounter++;
		string rec = tcp.receive();
		if( rec != "" )
		{
			cout << rec << endl;
			recivedDataCounter++;
		}
		
		cout << simulatedData.size() << '\t' << sendDataCounter << '\t' << recivedDataCounter << endl;
	}
	return 0;
}
