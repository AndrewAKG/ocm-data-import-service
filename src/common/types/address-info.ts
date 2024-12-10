import { Country } from './country';

interface AddressInfo {
  ID: number;
  AddressLine1: string;
  AddressLine2?: string | null;
  Town: string;
  StateOrProvince: string;
  Postcode: string;
  CountryID: number;
  Country: Country;
  Latitude: number;
  Longitude: number;
  ContactTelephone1?: string | null;
  ContactTelephone2?: string | null;
  ContactEmail: string;
  AccessComments: string;
  RelatedURL?: string | null;
  Distance?: number | null;
  DistanceUnit: number;
  Title: string;
}

export { AddressInfo };
