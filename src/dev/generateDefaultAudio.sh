#!/bin/sh

env=$( cat .env | grep '[^\n]' | sed -E "s/([^=]+)=([^\"].*[^\"])$/\1='\2'/g" )
eval $env

[ -z "PORT" ] && {
	PORT=8080
}

ENABLE_GENERATE_DEFAULT_AUDIO=true VERBOSE=false npm run start &

id=$( sleep 5 && curl -sL "localhost:$PORT/generateDefaultAudio" )

sed -i -E "s/DEFAULT_AUDIO_ID=[a-zA-Z0-9]+/DEFAULT_AUDIO_ID=$id/g" .env
cat .env | grep -E "DEFAULT_AUDIO_ID=.+" >/dev/null || {
	echo "\nDEFAULT_AUDIO_ID=$id\n" >> .env
}

echo "$id"
