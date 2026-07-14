export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com/api', // update for production
  tracing: {
    enabled: false,
    otlpEndpoint: 'http://localhost:4318/v1/traces'
  }
} as const;
