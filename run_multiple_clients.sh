#!/bin/bash
ip="127.0.0.1"
port=5050
clientThreads=()

if [ -z "$1" ]
then
	echo "No parameters found! Usage syntax: $0 count_of_clients"
	exit
fi

echo "running $1 client with server $ip on port $port"

for (( i=1; i <= $1; i++ ))
do
	 ./client $ip $port "Client$i" &
	echo "Client $i was running: $!"
	clientThreads+=($!)
	sleep 0.1s
done

echo "Clients threads: ${clientThreads[@]}"
echo "Size: ${#clientThreads[@]}"

# drop threads on Ctrl+C
trap 'echo "Stoping"; \
kill ${clientThreads[@]}; \
clientThreads=(); \
echo "Stoped"; \
exit' SIGINT
echo
echo "Press Ctrl+C to stop clients"
echo
while [ ${#clientThreads[@]} -ge 0 ]
do
	sleep 1s
done
