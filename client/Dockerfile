FROM gcc
WORKDIR /app
RUN apt-get update
RUN apt-get -y install iproute2
COPY . .
RUN make
ENTRYPOINT ["./run_multiple_clients.sh", "100", "", "50"]