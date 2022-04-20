#!/bin/bash
ip=$(tail -1 /etc/resolv.conf | cut -d' ' -f2)
port=5050
if [ -z "$ip" ]; then
	ip=$(ip -4 route show default | cut -d" " -f3)
fi
clientThreads=()

if [ -z "$1" ]
then
	echo "No parameters found!"
	echo "Usage syntax: $ $0 N [server-ip] [port]"
	exit
fi

if [ -n "$2" ]; then
	ip=$2
fi

if [ -n "$3" ]; then
	port=$3
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
