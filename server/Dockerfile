# Stage 1: Build Stage
FROM node:18.2.0-alpine 

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./

# Install Modules
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]