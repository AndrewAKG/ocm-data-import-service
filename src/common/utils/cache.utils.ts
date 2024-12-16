import { ReferenceDataResponse, ReferenceDataTransformServiceCacheMap } from '@common/types/ocm-api';

export const constructReferenceDataCacheMap = (
  referenceDataResponse: ReferenceDataResponse
): ReferenceDataTransformServiceCacheMap => {
  const referenceDataCache: ReferenceDataTransformServiceCacheMap = {
    ChargerTypes: {},
    StatusTypes: {},
    SubmissionStatusTypes: {},
    UsageTypes: {}
  };

  referenceDataResponse.ChargerTypes.forEach((ct) => {
    referenceDataCache!.ChargerTypes[ct.ID] = {
      IsFastChargeCapable: ct.IsFastChargeCapable
    };
  });
  referenceDataResponse.StatusTypes.forEach((st) => {
    referenceDataCache!.StatusTypes[st.ID] = {
      IsOperational: st.IsOperational
    };
  });
  referenceDataResponse.SubmissionStatusTypes.forEach((sst) => {
    referenceDataCache!.SubmissionStatusTypes[sst.ID] = {
      IsLive: sst.IsLive
    };
  });
  referenceDataResponse.UsageTypes.forEach((ut) => {
    referenceDataCache!.UsageTypes[ut.ID] = {
      IsAccessKeyRequired: ut.IsAccessKeyRequired,
      IsMembershipRequired: ut.IsMembershipRequired,
      IsPayAtLocation: ut.IsPayAtLocation
    };
  });

  return referenceDataCache;
};
