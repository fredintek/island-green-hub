FROM node:22

WORKDIR /usr/src/app

# Copy only package.json and package-lock.json first
COPY package*.json ./

# Ensure a clean install inside the container
RUN npm install

# Then copy the rest of the application
COPY . .

EXPOSE 1111

CMD ["npm", "run", "start:dev"]