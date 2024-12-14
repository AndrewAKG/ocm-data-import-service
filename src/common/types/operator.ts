import { AddressInfo } from './address-info';

interface Operator {
  WebsiteURL: string;
  Comments?: string | null;
  PhonePrimaryContact?: string | null;
  PhoneSecondaryContact?: string | null;
  IsPrivateIndividual: boolean;
  AddressInfo: AddressInfo | null;
  BookingURL: string | null;
  ContactEmail: string | null;
  FaultReportEmail: string | null;
  IsRestrictedEdit: boolean;
  ID: number;
  Title: string;
}

export { Operator };
