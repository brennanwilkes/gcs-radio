FROM node:12-alpine
ARG DB_CONNECTION=$DB_CONNECTION
ARG SPOTIFY_ID=$SPOTIFY_ID
ARG SPOTIFY_SECRET=$SPOTIFY_SECRET
ARG VERBOSE=$VERBOSE
ARG TOKEN_SECRET=$TOKEN_SECRET
ARG GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ARG GOOGLE_CLOUD_PROJECT=$GOOGLE_CLOUD_PROJECT
ARG SENDGRID_API_KEY=$SENDGRID_API_KEY
ARG MATCH_WITH_YOUTUBE=$MATCH_WITH_YOUTUBE
ARG MATCH_WITH_MUSICKIT=$MATCH_WITH_MUSICKIT
ARG DEFAULT_AUDIO_ID=$DEFAULT_AUDIO_ID
ARG MUSIC_KIT_SECRET=$MUSIC_KIT_SECRET
ARG MUSIC_KIT_TEAM_ID=$MUSIC_KIT_TEAM_ID
ARG MUSIC_KIT_KEY_ID=$MUSIC_KIT_KEY_ID

RUN apk add curl
RUN curl -f https://get.pnpm.io/v6.js | node - add --global pnpm

WORKDIR /usr/src/app

# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./


# Install production dependencies.
RUN pnpm install

# Copy local code to the container image.
COPY . ./

RUN npm run build:production

# Run the web service on container startup.
CMD [ "npm", "start" ]
