#!/bin/bash

# $1 -> HTTP_PROXY
# $2 -> HTTPS_PROXY

echo "HTTP_PROXY: $1"
if [ "$1" != null ]
then
  echo "Setting proxying"
  sh "npm config set proxy $1"
  sh "npm config set https-proxy $2"
fi
