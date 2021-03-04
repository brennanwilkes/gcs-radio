FROM node:12-alpine
ARG DB_CONNECTION=$DB_CONNECTION
ARG SPOTIFY_ID=$SPOTIFY_ID
ARG SPOTIFY_SECRET=$SPOTIFY_SECRET
ARG VERBOSE=$VERBOSE
ARG TOKEN_SECRET=$TOKEN_SECRET

RUN apk add --no-cache python py-pip
RUN apk add  --no-cache ffmpeg

WORKDIR /usr/src/app

# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
RUN npm install

# Copy local code to the container image.
COPY . ./

RUN npm run build
RUN npm prune --production

# Run the web service on container startup.
CMD [ "npm", "start" ]
