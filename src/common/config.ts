export const commonConfig = {
  ocmApiBaseUrl: 'https://api.openchargemap.io/v3',
  ocmApiKey: process.env.OCM_API_KEY,
  maxResultsPerApiCall: Number(process.env.MAX_RESULTS_PER_API_CALL || 50000) // Maximum results per bounding box
};
