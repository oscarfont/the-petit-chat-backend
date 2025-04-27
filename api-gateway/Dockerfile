FROM node:lts-hydrogen

WORKDIR /app
COPY . .
RUN npm install -g serverless@3 \
     && npm install --legacy-peer-deps \
      && rm -rf node_modules/serverless-offline/node_modules/velocityjs
EXPOSE 4000
CMD ["serverless", "offline", "start", "--host", "0.0.0.0"]