#!/usr/bin/bash

env=$( cat .env | grep '[^\n]' | sed -E "s/([^=]+)=([^\"].*[^\"])$/\1='\2'/g" )
eval "$env"
envArgs=$( cat .env | grep '[^\n]' | sed -E "s/([^=]+)=([^\"].*[^\"])$/\1='\2'/g" | xargs -I {} -- echo "--build-arg \\'{}\\'" | xargs)

#Why doesn't this work when I write it normally???
eval "sudo docker build $envArgs ."
