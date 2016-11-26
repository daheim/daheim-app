FROM node:6

WORKDIR /app
CMD tar c -C /tmp builder

RUN apt-get update && apt-get install -y git python
RUN npm install -q -g --no-optional --no-shrinkwrap sinopia

COPY sinopia /app/sinopia
COPY package.json /app/package.json
RUN npm set registry http://localhost:4873/ && \
    npm set //localhost:4873/:_authToken YkWb3SL2BVfHx8DLHAFoOw==

COPY ./lerna.json /app/
COPY ./packages/daheim-app-api/package.json /app/packages/daheim-app-api/
COPY ./packages/daheim-app-live/package.json /app/packages/daheim-app-live/
COPY ./packages/daheim-app-model/package.json /app/packages/daheim-app-model/
COPY ./packages/daheim-app-ui/package.json /app/packages/daheim-app-ui/
COPY ./packages/daheim-app-utils/package.json /app/packages/daheim-app-utils/
RUN sh -c "sinopia &" && \
    npm -q --unsafe-perm install

COPY . /app
RUN TS=$(git show -s --format=%ct HEAD) && \
    DATE=$(date --date @$TS +"%Y%m%d%H%M%S") && \
    REV=$(git rev-parse --short HEAD) && \
    VER=1.0.0-ci.$DATE.$REV && \
    echo $VER > REVISION

RUN node_modules/.bin/lerna publish -c --force-publish='*' --skip-git --skip-npm --yes --repo-version=$(cat REVISION) && \
    node_modules/.bin/lerna run build

RUN sh -c "sinopia &" && \
    node_modules/.bin/lerna publish -c --force-publish='*' --skip-git --yes --repo-version=$(cat REVISION)

RUN sh -c "sinopia &" && \
    mkdir /tmp/builder && \
    cp REVISION /tmp/builder/ && \
    cd /tmp/builder && \
    npm -q install daheim-app-ui daheim-app-api daheim-app-live
