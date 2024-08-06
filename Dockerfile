# Use an official Node.js runtime as a base image
FROM node:18-alpine

RUN apk update && apk add supervisor
RUN mkdir -p /var/log/supervisor

# Set the working directory in the container
WORKDIR /usr/src/app

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your app runs on
EXPOSE 3000

CMD ["/usr/bin/supervisord"]
