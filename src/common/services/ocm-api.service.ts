import axios from 'axios';
import { commonConfig } from '@common/config/config';
import { POI } from '@common/types/poi';
import { ReferenceDataResponse } from '@common/types/ocm-api';
import { throwError, logError } from '@common/utils/error';

export const fetchOcmPoiData = async (partioningParams: object = {}): Promise<POI[]> => {
  try {
    const response = await axios.get(`${commonConfig.ocmApiBaseUrl}/poi`, {
      params: {
        ...partioningParams,
        opendata: true,
        compact: true,
        maxresults: commonConfig.maxResultsPerApiCall
      },
      headers: {
        'X-API-Key': commonConfig.ocmApiKey
      }
    });

    return response.data;
  } catch (error: unknown) {
    logError(error, `Error fetching results for partioning params ${JSON.stringify(partioningParams)}`);
    return [];
  }
};

export const fetchOcmReferenceData = async (): Promise<ReferenceDataResponse> => {
  try {
    const response = await axios.get(`${commonConfig.ocmApiBaseUrl}/referencedata`, {
      headers: {
        'X-API-Key': commonConfig.ocmApiKey
      }
    });

    return response.data;
  } catch (error: unknown) {
    return throwError(error, `Error fetching reference data`);
  }
};
