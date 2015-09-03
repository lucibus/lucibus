FROM node:0.12.7
RUN npm install ajv@0.6.9

ADD validators/ajv.js /code/ajv.js
ADD schema.json /code/schema.json

CMD node /code/ajv.js
