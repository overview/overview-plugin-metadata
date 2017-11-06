FROM node:9.0.0-alpine

# npm install should be cached, so website changes don't necessarily
# force another npm install
COPY dist/package.json dist/package-lock.json /site/
RUN cd /site && npm install

# After a website change, this code will be run
COPY dist/server.js dist/in-memory-website.data /site/

EXPOSE 80
CMD /usr/local/bin/node /site/server.js
