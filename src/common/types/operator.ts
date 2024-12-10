import { AddressInfo } from './address-info';

interface Operator {
  WebsiteURL: string;
  Comments?: string | null;
  PhonePrimaryContact?: string | null;
  PhoneSecondaryContact?: string | null;
  IsPrivateIndividual: boolean;
  AddressInfo: AddressInfo;
  BookingURL: string;
  ContactEmail: string;
  FaultReportEmail: string;
  IsRestrictedEdit: boolean;
  ID: number;
  Title: string;
}

export { Operator };
