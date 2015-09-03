FROM node:0.12.7
RUN npm install tv4@1.2.3

ADD validators/tv4.js /code/tv4.js
ADD schema.json /code/schema.json

CMD node /code/tv4.js
