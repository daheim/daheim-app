FROM node:6

RUN apt-get update && apt-get install -y git python

RUN npm install -g sinopia
RUN sh -c "sinopia &" && \
    npm install -g lerna@^2.0.0-beta

WORKDIR /app

ADD sinopia /app/sinopia
ADD package.json /app/package.json
RUN npm set registry http://localhost:4873/ && \
    sh -c "sinopia &" && \
    npm install

ADD . /app

RUN sh -c "sinopia &" && \
    lerna bootstrap

RUN lerna run build

RUN sh -c "sinopia &" && \
  npm set //localhost:4873/:_authToken YkWb3SL2BVfHx8DLHAFoOw== && \
  lerna publish -c --force-publish='*' --skip-git --yes

RUN sh -c "sinopia &" && \
    cd /tmp && \
    npm install daheim-app-ui daheim-app-api daheim-app-live
