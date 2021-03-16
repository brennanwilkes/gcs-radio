#!/usr/bin/bash

eval source '~/google-cloud-sdk/path.bash.inc'


env=$( cat .env | grep '[^\n]' | sed -E "s/([^=]+)=([^\"].*[^\"])$/\1='\2'/g" )
eval $env

gcloud config set project $GOOGLE_CLOUD_PROJECT

gcloud functions deploy gcs-radio --entry-point serverless --allow-unauthenticated --trigger-http --runtime nodejs12 --set-env-vars="DB_CONNECTION=$DB_CONNECTION" --set-env-vars="SPOTIFY_ID=$SPOTIFY_ID" --set-env-vars="SPOTIFY_SECRET=$SPOTIFY_SECRET" --set-env-vars="VERBOSE=true" --set-env-vars="YTDL_COOKIE=$YTDL_COOKIE" --set-env-vars="GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID" --set-env-vars="GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET" --set-env-vars="GOOGLE_CLOUD_PROJECT=$GOOGLE_CLOUD_PROJECT"
