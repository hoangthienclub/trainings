const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

/**
 * Khởi tạo OpenTelemetry tracing cho một service
 * @param {string} serviceName - Tên của service
 * @param {string} jaegerEndpoint - Jaeger collector endpoint (mặc định: http://localhost:14268/api/traces)
 */
function initTracing(serviceName, jaegerEndpoint = 'http://localhost:14268/api/traces') {
  // Cấu hình Jaeger exporter để gửi traces
  const jaegerExporter = new JaegerExporter({
    endpoint: jaegerEndpoint,
  });

  // Tạo SDK với auto-instrumentation
  const sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
    traceExporter: jaegerExporter,
    instrumentations: [
      getNodeAutoInstrumentations({
        // Tự động instrument HTTP requests
        '@opentelemetry/instrumentation-http': {
          enabled: true,
        },
        // Tự động instrument Express
        '@opentelemetry/instrumentation-express': {
          enabled: true,
        },
      }),
    ],
  });

  // Start SDK
  sdk.start();
  console.log(`🔍 Tracing initialized for ${serviceName}`);

  // Graceful shutdown
  process.on('SIGTERM', () => {
    sdk
      .shutdown()
      .then(() => console.log('Tracing terminated'))
      .catch((error) => console.log('Error terminating tracing', error))
      .finally(() => process.exit(0));
  });

  return sdk;
}

module.exports = { initTracing };
