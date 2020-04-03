FROM node:10-alpine

# Set to a non-root built-in user `node`
USER node

###############
# Build front
RUN mkdir -p /home/node/front
WORKDIR /home/node/front
COPY --chown=node ./front/package*.json ./
RUN npm install
COPY --chown=node ./front .
RUN npm run build

###############
# Build back

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

RUN cp -r /home/node/front/dist ./public && \
    npm run build && \
    npm prune --production && \
    rm -rf /home/node/front && \
    rm -rf /home/node/back/src

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=3000

EXPOSE ${PORT}
CMD [ "node", "." ]
