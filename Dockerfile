FROM node:12-alpine

WORKDIR /usr/src/app

# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
RUN npm install

# Copy local code to the container image.
COPY . ./

RUN npm run build
RUN npm prune --production

RUN ls -al . [ps]*/

# Run the web service on container startup.
CMD [ "npm", "start" ]
