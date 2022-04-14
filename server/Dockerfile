FROM node
WORKDIR /app
COPY package.json .
RUN npm install
EXPOSE 3000 5050
COPY server.js .
CMD ["node", "server.js"]