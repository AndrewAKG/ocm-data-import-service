import axios from 'axios';
import { commonConfig } from '@common/config/config';
import { POI } from '@common/types/poi';
import { ReferenceDataResponse } from '@common/types/ocm-api';

let response;

export const fetchOcmPoiData = async (partioningParams: object = {}): Promise<POI[]> => {
  try {
    response = await axios.get(`${commonConfig.ocmApiBaseUrl}/poi`, {
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
  } catch (error: any) {
    console.error(`Error fetching results for partioning params ${JSON.stringify(partioningParams)}: ${error.message}`);
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
  } catch (error: any) {
    console.error('Error fetching ocm reference data', error.message);
    throw new Error('Error fetching reference data');
  }
};
