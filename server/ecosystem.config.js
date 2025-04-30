module.exports = {
  apps: [
    {
      name: "server", // Name of the application
      script: "nodemon", // Use nodemon to run the server
      args: "server.ts", // Entry point of the server
      watch: true, // Watch for file changes with nodemon
      interpreter: "ts-node", // Use ts-node to run TypeScript files
      env: {
        NODE_ENV: "development", // Environment variable for development
      },
      env_production: {
        NODE_ENV: "production", // Environment variable for production
      },
    },
  ],
};
