import axios from 'axios';
import { commonConfig } from '@common/config/config';
import { POI } from '@common/types/poi';

let response;

export const fetchOcmPoiData = async (boundingBox: string): Promise<POI[]> => {
  try {
    response = await axios.get(`${commonConfig.ocmApiBaseUrl}/poi`, {
      params: {
        boundingbox: boundingBox,
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
    console.error(`Error fetching results for bounding box ${JSON.stringify(boundingBox)}: ${error.message}`);
    return [];
  }
};

export const fetchOcmReferenceData = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${commonConfig.ocmApiBaseUrl}/referencedata`, {
      headers: {
        'X-API-Key': commonConfig.ocmApiKey
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('Error fetching ocm reference data', error.message);
    return [];
  }
};
