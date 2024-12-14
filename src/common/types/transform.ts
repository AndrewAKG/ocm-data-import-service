import { ReferenceDataResponse } from './ocm-api';
import { POI } from './poi';
import { TransformedPOIData, TransformedReferenceData } from './transformers';

export interface TransformService {
  /**
   * Transforms the reference data from the OCM API into the required structure.
   * @param referenceData - The reference data from the OCM API.
   * @returns TransformedReferenceData - The transformed reference data.
   */
  transformReferenceData(referenceData: ReferenceDataResponse): TransformedReferenceData;

  /**
   * Transforms an array of POI data.
   * @param POIs - The array of POIs to transform.
   * @returns TransformedPOIData - The transformed POI data.
   */
  transformPOIData(POIs: POI[]): TransformedPOIData;
}
