FROM dockerfile/nodejs

COPY package.json /seguir-example-app/package.json
RUN cd /seguir-example-app; npm install
COPY . /seguir-example-app

WORKDIR /seguir-example-app

EXPOSE 4000

CMD ["node", "server"]
