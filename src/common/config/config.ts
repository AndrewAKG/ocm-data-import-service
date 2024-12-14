const maxResultsPerApiCall = Number(process.env.MAX_RESULTS_PER_API_CALL || 50000);
export const commonConfig = {
  ocmApiBaseUrl: 'https://api.openchargemap.io/v3',
  ocmApiKey: process.env.OCM_API_KEY || 'ocm_api_key',
  maxResultsPerApiCall: maxResultsPerApiCall,
  queueUri: process.env.QUEUE_URI || 'amqp://rabbitmq:5672',
  queueName: process.env.QUEUE_NAME || 'ocm-data-partitions-queue',
  mongoUri: process.env.MONGO_URI || 'mongodb://mongo:27017/ocm-data',
  commonPartitioningParams: {
    opendata: true,
    compact: true,
    verbose: false
  }
};
