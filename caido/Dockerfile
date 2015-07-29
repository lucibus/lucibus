FROM node:0.12.7

ENV NODE_PATH /install/node_modules/
ENV PATH /install/node_modules/.bin:$PATH

COPY ./package.json /install/package.json
WORKDIR /install/
RUN npm install

WORKDIR /caido/
ADD . /caido/
