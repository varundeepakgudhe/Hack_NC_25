# Step 1: Use official Node.js image
FROM node:18-alpine

# Step 2: Set working directory in container
WORKDIR /app

# Step 3: Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Step 4: Copy the rest of the application
COPY . .

# Step 5: Build the React app
RUN npm run build

# Step 6: Serve the app with a lightweight server (serve)
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]

# Step 7: Expose the container port
EXPOSE 3000