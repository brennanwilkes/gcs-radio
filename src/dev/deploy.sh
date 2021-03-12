#!/usr/bin/bash

eval source '~/google-cloud-sdk/path.bash.inc'

deployment="$1"

env=$( cat .env | grep '[^\n]' | sed -E "s/([^=]+)=([^\"].*[^\"])$/\1='\2'/g" )
eval $env


gcloud config set project $GOOGLE_CLOUD_PROJECT

gcloud builds submit --tag gcr.io/$GOOGLE_CLOUD_PROJECT/$deployment
gcloud run deploy gcs-radio-beta --image gcr.io/$GOOGLE_CLOUD_PROJECT/$deployment --platform managed --region us-west1 --allow-unauthenticated --concurrency 1 --cpu 1 --memory 256M --max-instances 4 --set-env-vars="DB_CONNECTION=$DB_CONNECTION" --set-env-vars="SPOTIFY_ID=$SPOTIFY_ID" --set-env-vars="SPOTIFY_SECRET=$SPOTIFY_SECRET" --set-env-vars="VERBOSE=true" --set-env-vars="YTDL_COOKIE=$YTDL_COOKIE" --set-env-vars="TOKEN_SECRET=$TOKEN_SECRET" --set-env-vars="GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID" --set-env-vars="GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET" --set-env-vars="GOOGLE_CLOUD_PROJECT=$GOOGLE_CLOUD_PROJECT" --set-env-vars="SENDGRID_API_KEY=$SENDGRID_API_KEY"
