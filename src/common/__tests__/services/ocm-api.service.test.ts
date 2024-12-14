import axios from 'axios';
import { createOcmApiService } from '@common/services/ocm-api.service';
import { POI } from '@common/types/poi';
import { ReferenceDataResponse } from '@common/types/ocm-api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('OcmApiService', () => {
  const ocmApiService = createOcmApiService();
  const mockBaseUrl = 'http://mock-ocm-api.com';
  const mockApiKey = 'mock-api-key';

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    process.env = {
      ...process.env,
      OCM_API_BASE_URL: mockBaseUrl,
      OCM_API_KEY: mockApiKey
    };
  });

  describe('fetchOcmPoiData', () => {
    it('should fetch POI data successfully', async () => {
      const mockPartitioningParams = { boundingBox: '(-90,-180),(90,180)' };
      const mockResponseData: POI[] = [];

      mockedAxios.get.mockResolvedValueOnce({ data: mockResponseData });

      const result = await ocmApiService.fetchOcmPoiData(mockPartitioningParams);

      expect(mockedAxios.get).toHaveBeenCalledWith(`${mockBaseUrl}/poi`, {
        params: {
          ...mockPartitioningParams,
          opendata: true,
          compact: true,
          maxresults: undefined
        },
        headers: {
          'X-API-Key': mockApiKey
        }
      });
      expect(result).toEqual(mockResponseData);
    });

    it('should return an empty array if an error occurs', async () => {
      const mockPartitioningParams = { boundingBox: '(-90,-180),(90,180)' };

      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      const result = await ocmApiService.fetchOcmPoiData(mockPartitioningParams);

      expect(mockedAxios.get).toHaveBeenCalledWith(`${mockBaseUrl}/poi`, expect.any(Object));
      expect(result).toEqual([]);
    });
  });

  describe('fetchOcmReferenceData', () => {
    it('should fetch reference data successfully', async () => {
      const mockResponseData: ReferenceDataResponse = {
        ChargerTypes: [],
        ConnectionTypes: [],
        CheckinStatusTypes: [],
        Countries: [],
        CurrentTypes: [],
        DataProviders: [],
        Operators: [],
        StatusTypes: [],
        SubmissionStatusTypes: [],
        UsageTypes: [],
        UserCommentTypes: []
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockResponseData });

      const result = await ocmApiService.fetchOcmReferenceData();

      expect(mockedAxios.get).toHaveBeenCalledWith(`${mockBaseUrl}/referencedata`, {
        headers: {
          'X-API-Key': mockApiKey
        }
      });
      expect(result).toEqual(mockResponseData);
    });

    it('should throw an error if fetching reference data fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API error'));

      await expect(ocmApiService.fetchOcmReferenceData()).rejects.toThrow('Error fetching reference data');
      expect(mockedAxios.get).toHaveBeenCalledWith(`${mockBaseUrl}/referencedata`, expect.any(Object));
    });
  });
});
