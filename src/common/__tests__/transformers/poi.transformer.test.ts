import { transformSubmissionStatus, transformUsageType, transformPOI } from '../../transformers';
import { SubmissionStatus, UsageType, POI } from '@common/types/poi';
import { SubmissionStatusDocument } from '@common/models/submission-status-types.model';
import { UsageTypeDocument } from '@common/models/usage-type.model';
import { POIDocument } from '@common/models/poi.model';

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
      const fakeUUID = 'uuid';
      const poi: POI = {
        UUID: fakeUUID,
        ID: 148527,
        MediaItems: [],
        IsRecentlyVerified: true,
        DateLastVerified: '2024-12-12T00:00:00Z',
        ParentChargePointID: 0,
        UsageCost: 'Free',
        AddressInfo: {
          ID: 1,
          AddressLine1: '123 Main Street',
          Town: 'Testville',
          StateOrProvince: 'Test State',
          Postcode: '12345',
          CountryID: 1,
          Country: { ID: 1, ISOCode: 'US', ContinentCode: 'NA', Title: 'United States' },
          Latitude: 40.7128,
          Longitude: -74.006,
          ContactEmail: 'test@test.com',
          AccessComments: 'Accessible 24/7',
          DistanceUnit: 1,
          Title: 'Main Street Station'
        },
        Connections: [],
        NumberOfPoints: 4,
        GeneralComments: 'Test comments',
        DatePlanned: null,
        DateLastConfirmed: null,
        DateLastStatusUpdate: '2024-12-12T00:00:00Z',
        DataQualityLevel: 5,
        DateCreated: '2024-12-12T00:00:00Z',
        DataProviderID: 1,
        DataProvidersReference: 'ProviderRef123',
        OperatorID: 1,
        OperatorsReference: 'OperatorRef123',
        UsageTypeID: 1,
        StatusTypeID: 1,
        SubmissionStatusTypeID: 1,
        UserComments: []
      };

      const { ID, UUID, ...rest } = poi;
      const expected: POIDocument = {
        _id: UUID,
        ...rest
      };

      const result = transformPOI(poi);

      expect(result).toEqual(expected);
    });
  });
});
