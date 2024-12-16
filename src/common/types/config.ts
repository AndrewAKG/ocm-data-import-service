import { OCMApiQueryParams } from './ocm-api';

export type CommonConfig = {
  ocmApiBaseUrl: string;
  ocmApiKey: string;
  maxResultsPerApiCall: number;
  queueUri: string;
  queueName: string;
  mongoUri: string;
  commonPartitioningParams: OCMApiQueryParams;
};
