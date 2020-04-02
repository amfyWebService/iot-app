# étape de build
FROM node:10-alpine as build-front
RUN mkdir -p /home/node/front
WORKDIR /home/node/front
COPY ./front/package*.json ./
RUN npm install
COPY ./front .
RUN npm run build
# étape de production

FROM node:10-alpine

# Set to a non-root built-in user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/back

WORKDIR /home/node/back

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node ./back/package*.json ./

RUN npm install

# Bundle app source code
COPY --chown=node ./back .
COPY --chown=node --from=build-front /home/node/front/dist ./public

RUN npm run build

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=3000

EXPOSE ${PORT}
CMD [ "node", "." ]
