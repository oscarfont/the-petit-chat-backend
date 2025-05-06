#!/bin/bash

mkdir output

docker build -f lambda-builder.dockerfile -t lambda-builder .
docker run --rm -v "$(pwd)"/output:/output lambda-builder

chmod -R 777 output
mv /home/ofont/Proyectos/petit-chat/the-petit-chat-backend/ai-service/output/ai-service.zip /home/ofont/Proyectos/petit-chat/the-petit-chat-backend/ai-service/ai-service.zip
rm -r output

cd /home/ofont/Proyectos/petit-chat/the-petit-chat-backend/ai-service/app && \
  zip -r /home/ofont/Proyectos/petit-chat/the-petit-chat-backend/ai-service/ai-service.zip . -x "*__pycache__/*"
