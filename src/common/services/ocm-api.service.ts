import axios from 'axios';
import { POI } from '@common/types/poi';
import { OCMApiQueryParams, OCMApiService, ReferenceDataResponse } from '@common/types/ocm-api';
import { throwError, logError } from '@common/utils/error.utils';

export const createOcmApiService = (ocmApiBaseUrl: string, ocmApiKey: string): OCMApiService => {
  return {
    /**
     * Fetches POI data from the OCM API with optional partitioning parameters.
     * @param partioningParams Parameters for filtering the POI data.
     * @returns A list of POI objects.
     */
    fetchOcmPoiData: async (partioningParams: OCMApiQueryParams = {}): Promise<POI[]> => {
      try {
        const response = await axios.get(`${ocmApiBaseUrl}/poi`, {
          params: {
            ...partioningParams
          },
          headers: {
            'X-API-Key': ocmApiKey
          }
        });

        return response.data;
      } catch (error: unknown) {
        logError(error, `Error fetching results for partioning params ${JSON.stringify(partioningParams)}`);
        return [];
      }
    },

    /**
     * Fetches reference data from the OCM API.
     * @returns A response containing reference data.
     */
    fetchOcmReferenceData: async (): Promise<ReferenceDataResponse> => {
      try {
        const response = await axios.get(`${ocmApiBaseUrl}/referencedata`, {
          headers: {
            'X-API-Key': ocmApiKey
          }
        });

        return response.data;
      } catch (error: unknown) {
        return throwError(error, `Error fetching reference data`);
      }
    }
  };
};
