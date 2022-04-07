all: client

client:
	g++ -Wall -o client client.cpp -I network/src/ network/src/TCPServer.cpp network/src/TCPClient.cpp -std=c++11 -lpthread

clean:
	rm client
