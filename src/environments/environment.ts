
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001/api',
  // tracing configuration used by src/app/tracing.ts
  tracing: {
    // set to false to disable tracing in this environment
    enabled: true,
    // OTLP HTTP endpoint (collector)
    otlpEndpoint: 'http://localhost:4318/v1/traces'
  }
} as const;

