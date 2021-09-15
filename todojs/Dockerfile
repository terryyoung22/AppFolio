FROM node:latest

WORKDIR /app

# adding .bin to $PATH of container
ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./
RUN npm install
COPY . ./


# start app
CMD ["node", "index.js"]