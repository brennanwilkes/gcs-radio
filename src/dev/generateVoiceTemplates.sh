#!/bin/sh

env=$( cat .env | grep '[^\n]' | sed -E "s/([^=]+)=([^\"].*[^\"])$/\1='\2'/g" )
eval $env

[ -z "PORT" ] && {
	PORT=8080
}

ENABLE_GENERATE_TEMPLATES=true VERBOSE=false npm run start &

sleep 5 && curl -sL "localhost:$PORT/generateTemplates"
