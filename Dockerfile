FROM node:0.12.4

COPY ./package.json /install/package.json
WORKDIR /install
RUN npm install

ENV PATH /install/node_modules/.bin:$PATH
