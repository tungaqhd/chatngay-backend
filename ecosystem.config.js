module.exports = {
  apps: [
    {
      name: "chatngay",
      script: "./app.js",
      max_memory_restart: "4G",
      env: {
        NODE_ENV: "production",
        PORT: 8081,
        DATABASE: "mongodb://localhost/chat-ngay",
        JWT_SECRET: "chatngay.comtest",
      },
    },
  ],
};
