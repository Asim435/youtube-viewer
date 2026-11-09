FROM alpine:latest

# Install runtime packages
RUN apk update && \
    apk add --no-cache \
      chromium \
      nodejs \
      npm \
      tor \
      ca-certificates

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV NODE_ENV=production
ENV YOUTUBE_VIEWER_FORCE_DEBUG=false

# Create app directory
WORKDIR /app

RUN which chromium-browser || ln -s /usr/bin/chromium /usr/bin/chromium-browser

# Copy app artifacts and dependencies
COPY ./core ./core 
COPY ./handlers ./handlers
COPY ./helpers ./helpers
COPY ./services ./services
COPY ./utils ./utils
COPY ./index.js .
COPY ./package.json .
COPY ./urls.txt .

RUN npm install --production

CMD ["node", "index", "--color=16m"]