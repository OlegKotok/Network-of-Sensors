#include <iostream>
#include <signal.h>
#include "TCPClient.h"

#include <string>
#include <queue>
#include <mutex>
#include <stdlib.h>
#include <thread>
#include <chrono>

const uint sendDataLimit = 1000;
const uint signalDelayInMilliseconds = 500;
const uint refreshTimeSeconds = 60;
const uint sendDataDelayInMilliseconds = 100;

TCPClient tcp;

void sig_exit(int s)
{
	tcp.exit();
	exit(0);
}

const std::string defaultClientId = "Defauld client ID";
std::queue <string> simulatedData;
std::mutex mtx;

void pushRandomData(std::queue <string> &container, int delayInMs = 100)
{
	srand (time(nullptr));
	static uint64_t counter = 1;
	while (true)
	{
		string m = std::to_string(counter++) + '-' + std::to_string(rand() % 2000000 - 1000000);
		mtx.lock();
		container.push(m);
		mtx.unlock();
		this_thread::sleep_for( chrono::milliseconds(delayInMs) );
	}
}

string prepareMessageToServer(std::queue <string> &data, std::string const &clientId)
{
	time_t now;
	time(&now);

	std::string m = "{\n \
    \"Client\": \""    +    clientId    	+  "\", \
    \"Data\": \""      +    data.front()	+  "\", \
    \"Timestamp\": \""	+   ctime(&now)		+  "\"\n}";
	m[m.size()-4] = ' '; //replace \n in timestamp

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

	/** run simulation in separate thread **/
	std::thread (pushRandomData, std::ref(simulatedData), signalDelayInMilliseconds).detach();

	uint sendDataCounter = 0;
	uint recivedDataCounter = 0;

	const std::string clientId = (argc == 4) ? argv[3] : defaultClientId;
	bool tcpOk = tcp.setup(argv[1],atoi(argv[2]));
	cout << "Connection to server: " << ( (tcpOk) ? "OK" : "not OK" ) << endl;

	/** sens data thread **/
	std::thread ([&]()
	{
		while(tcpOk) {
			/** wait data from buffer **/
			while (simulatedData.empty()) this_thread::sleep_for( chrono::milliseconds( 500 ) );

			tcp.Send( prepareMessageToServer(simulatedData, clientId) );
			sendDataCounter++;
			if (sendDataCounter >= sendDataLimit) tcpOk = false; //stop data transfer
			this_thread::sleep_for( chrono::milliseconds( sendDataDelayInMilliseconds ) );
		}
	}).detach();

	/** receive data thread **/
	std::thread ([&]()
	{
		while(tcpOk) {
			string rec = tcp.receive();
			if( rec != "" ) recivedDataCounter++;
			//if( rec != "" ) cout << "Recive: " << rec << endl;
		}
	}).detach();

	/** data status info **/
	if (tcpOk) cout << "Client_Id \t Query data \t Sent data \t Recived data" << endl;
	while(tcpOk) {
		this_thread::sleep_for( chrono::seconds(refreshTimeSeconds));	
		cout << clientId << "\t\t" << simulatedData.size() << "\t\t" << sendDataCounter << "\t\t" << recivedDataCounter << endl;
	}
	cout << endl << clientId << endl;
	cout <<"SENT DATA: " << sendDataCounter << endl;
	cout <<"RECIVED DATA: " << recivedDataCounter << endl;
	return 0;
}
