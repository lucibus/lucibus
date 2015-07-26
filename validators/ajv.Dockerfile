FROM node:12.7
RUN npm install ajv@0.6.9

ADD validators/ajv.js /code/ajv.js
ADD sample.json /code/sample.json
ADD schema.json /code/schema.json

CMD node /code/ajv.js
