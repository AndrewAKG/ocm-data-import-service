import axios from 'axios';
import { commonConfig } from '../../common/config';
import { config } from '../config/config';

export const fetchOCMResults = async (boundingBox: string): Promise<any[]> => {
  try {
    const response = await axios.get(`${commonConfig.OCM_API_BASE_URL}/poi`, {
      params: {
        boundingbox: boundingBox,
        opendata: true,
        compact: true,
        verbose: false,
        maxresults: config.maxResults
      },
      headers: {
        'X-API-Key': commonConfig.OCM_API_KEY
      }
    });

    return response.data;
  } catch (error: any) {
    console.error(`Error fetching results for bounding box ${JSON.stringify(boundingBox)}: ${error.message}`);
    return [];
  }
};
