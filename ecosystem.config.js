module.exports = {
  apps: [
    {
      name: "lotus-hr",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 16310 -H 0.0.0.0",
      cwd: "/opt/lotus-hr-dashboard",
      env: {
        NODE_ENV: "production",
        PORT: 16310,
        HOSTNAME: "0.0.0.0",
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
    },
  ],
};
