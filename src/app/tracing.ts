/**
 * Tracing stub — OpenTelemetry packages are not installed.
 * Replace the body of initTracing / shutdownTracing once the packages are added.
 */

export interface TracingConfig {
  enabled?: boolean;
  endpoint?: string;
}

/** No-op until OpenTelemetry packages are installed. */
export function initTracing(config: TracingConfig = {}): void {
  void config;
  // intentional no-op
}

/** No-op until OpenTelemetry packages are installed. */
export function shutdownTracing(): void {
  // intentional no-op
}
