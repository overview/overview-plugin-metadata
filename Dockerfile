FROM alpine:3.7 as common

RUN apk add --update --no-cache nodejs

WORKDIR /app


FROM common as build

RUN apk add --update --no-cache nodejs-npm

COPY dist/package.json dist/package-lock.json /app/

RUN npm install --production

COPY dist/server.js dist/in-memory-website.data /app/


FROM common as production

EXPOSE 80

COPY --from=build /app/ /app/

CMD [ "/usr/bin/node", "/app/server.js" ]
