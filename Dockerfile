FROM ubuntu:18.04

RUN apt-get update

RUN apt-get install -y curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

ADD package.json package-lock.json /app/
WORKDIR /app
RUN npm install

ADD . /app/

EXPOSE 443
EXPOSE 80

CMD ["node", "app.js"]