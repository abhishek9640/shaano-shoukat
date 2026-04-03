module.exports = {
  apps: [
    // ── Backend API ──
    {
      name: 'shaanoshaukat-api',
      script: 'src/server.js',
      cwd: '/home/ubuntu/shaanoshaukat/backend',
      instances: 2, // 2 workers on t3.small (2 vCPU)
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      // Logging
      error_file: '/home/ubuntu/logs/api-error.log',
      out_file: '/home/ubuntu/logs/api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      // Auto-restart
      max_memory_restart: '300M',
      restart_delay: 5000,
      max_restarts: 10,
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 10000,
      // Watch (disable in production)
      watch: false,
    },
  ],
};


