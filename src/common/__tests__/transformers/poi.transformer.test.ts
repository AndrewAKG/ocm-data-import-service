import { transformSubmissionStatus, transformUsageType, transformPOI } from '../../transformers';
import { SubmissionStatus, UsageType, POI } from '@common/types/poi';
import { SubmissionStatusDocument } from '@common/models/submission-status-types.model';
import { UsageTypeDocument } from '@common/models/usage-type.model';
import { POIDocument } from '@common/models/poi.model';
import mockPoiData from '@mocks/poi.json';
import mockReferenceData from '@mocks/reference-data.json';
import { constructReferenceDataCacheMap } from '@common/utils/cache.utils';

describe('Transformers', () => {
  describe('transformSubmissionStatus', () => {
    it('should correctly transform a SubmissionStatus object to SubmissionStatusDocument', () => {
      const submissionStatus: SubmissionStatus = {
        ID: 1,
        Title: 'Submitted',
        IsLive: true
      };

      const expected: SubmissionStatusDocument = {
        _id: 1,
        Title: 'Submitted',
        IsLive: true
      };

      const result = transformSubmissionStatus(submissionStatus);

      expect(result).toEqual(expected);
    });
  });

  describe('transformUsageType', () => {
    it('should correctly transform a UsageType object to UsageTypeDocument', () => {
      const usageType: UsageType = {
        ID: 2,
        Title: 'Public',
        IsPayAtLocation: false,
        IsMembershipRequired: true,
        IsAccessKeyRequired: false
      };

      const expected: UsageTypeDocument = {
        _id: 2,
        Title: 'Public',
        IsPayAtLocation: false,
        IsMembershipRequired: true,
        IsAccessKeyRequired: false
      };

      const result = transformUsageType(usageType);

      expect(result).toEqual(expected);
    });
  });

  describe('transformPOI', () => {
    it('should correctly transform a POI object to POIDocument', () => {
      const poi: POI = mockPoiData[0];
      const referenceDataCache = constructReferenceDataCacheMap(mockReferenceData);

      const { UUID, ...rest } = poi;
      const expected: POIDocument = {
        _id: UUID,
        ...rest,
        ChargerType: {
          IsFastChargeCapable: false
        },
        StatusType: {
          IsOperational: true
        },
        UsageType: {
          IsPayAtLocation: false,
          IsMembershipRequired: true,
          IsAccessKeyRequired: true
        },
        SubmissionStatus: {
          IsLive: true
        }
      };

      const result = transformPOI(poi, referenceDataCache);

      expect(result).toEqual(expected);
    });
  });
});
