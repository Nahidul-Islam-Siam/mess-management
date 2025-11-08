// for nextjs project

module.exports = {
  apps: [
    {
      name: "digital-animal-dashboard",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3001
      },
    },
  ],
};
