FROM node:6

ADD package.json /app/package.json
RUN cd /app && npm install

ADD . /app
WORKDIR /app

RUN npm run build
RUN npm prune --production
RUN mv Dockerfile.run Dockerfile

CMD tar -cf - .
