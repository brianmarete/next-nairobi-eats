module.exports = {
  apps: [
    {
      name: "nairobi-eats",
      cwd: "/var/www/nairobi-eats",

      script: "./node_modules/next/dist/bin/next",
      args: "start --hostname 127.0.0.1 --port 3000",

      instances: 1,
      exec_mode: "fork",
      watch: false,

      env_production: {
        NODE_ENV: "production",
        NODE_OPTIONS: "--max-old-space-size=512",
      },

      autorestart: true,
      restart_delay: 5000,
      max_memory_restart: "700M",
      min_uptime: "10s",
      max_restarts: 10,

      kill_timeout: 30000,
      time: true,
      merge_logs: true,
    },
  ],
};
