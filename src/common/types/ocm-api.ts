import { ChargerType } from './charger-type';
import { CheckinStatusType, CommentType } from './comment';
import { ConnectionType } from './connection';
import { Country } from './country';
import { DataProvider } from './data-provider';
import { Operator } from './operator';
import { POI, SubmissionStatus, UsageType } from './poi';
import { StatusType } from './status-types';
import { SupplyType } from './supply-type';

export interface ReferenceDataTransformServiceCacheMap {
  ChargerTypes: {
    [key: number]: {
      IsFastChargeCapable: boolean;
    };
  };
  UsageTypes: {
    [key: number]: {
      IsPayAtLocation: boolean;
      IsMembershipRequired: boolean;
      IsAccessKeyRequired: boolean;
    };
  };
  SubmissionStatusTypes: {
    [key: number]: {
      IsLive: boolean;
    };
  };
  StatusTypes: {
    [key: number]: {
      IsOperational: boolean;
    };
  };
}
export interface ReferenceDataResponse {
  ChargerTypes: ChargerType[];
  ConnectionTypes: ConnectionType[];
  CheckinStatusTypes: CheckinStatusType[];
  Countries: Country[];
  CurrentTypes: SupplyType[];
  DataProviders: DataProvider[];
  Operators: Operator[];
  StatusTypes: StatusType[];
  SubmissionStatusTypes: SubmissionStatus[];
  UsageTypes: UsageType[];
  UserCommentTypes: CommentType[];
}

export interface OCMApiQueryParams {
  boundingbox?: string; // (lat, lng), (lat2, lng2) for bounding box
  camelcase?: boolean; // Return properties in camelCase format
  chargepointid?: string; // Comma-separated list of OCM POI IDs
  client?: string; // Client application identifier
  compact?: boolean; // Remove reference data objects from output
  connectiontypeid?: string; // List of connection type IDs
  countrycode?: string; // 2-character ISO country code
  countryid?: string; // List of numeric country IDs
  dataproviderid?: string; // List of data provider IDs
  distance?: number; // Max distance for filtering results
  distanceunit?: 'miles' | 'km'; // Distance unit, default is 'miles'
  includecomments?: boolean; // Include user comments and media items
  latitude?: number; // Latitude for distance calculation/filtering
  longitude?: number; // Longitude for distance calculation/filtering
  maxresults?: number; // Max number of results, default is 100
  opendata?: boolean; // Include only OCM-provided open data
  operatorid?: string; // List of operator IDs
  output?: 'json' | 'geojson' | 'xml' | 'csv'; // Output format, default is 'json'
  polygon?: string; // Encoded polyline for a polygon shape
  polyline?: string; // Encoded polyline for a search line
  statustypeid?: string; // List of status type IDs
  usagetypeid?: string; // List of usage type IDs
  verbose?: boolean; // Include full result set, default is true
}

export type POIDataResponse = POI[];

export interface OcmApiService {
  /**
   * Fetches POI data from the OCM API.
   * @param partitioningParams - The partitioning parameters for the API request.
   * @returns Promise<POI[]> - The fetched POI data.
   */
  fetchOcmPoiData(partitioningParams?: OCMApiQueryParams): Promise<POI[]>;

  /**
   * Fetches reference data from the OCM API.
   * @returns Promise<ReferenceDataResponse> - The fetched reference data.
   */
  fetchOcmReferenceData(): Promise<ReferenceDataResponse>;
}
