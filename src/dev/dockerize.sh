#!/usr/bin/bash

env=$( cat .env | grep '[^\n]' | sed -E "s/([^=]+)=([^\"].*[^\"])$/\1='\2'/g" )
eval $env

sudo docker build .
