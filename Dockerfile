FROM node:latest

RUN apt-get update
RUN apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# Create the directory!
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

# Copy and Install our bot
COPY package.json /usr/src/bot
RUN npm install

# Our precious bot
COPY . /usr/src/bot

# Start me!
CMD ["sh", "-c", "node deploy-commands.js && node index.js"]