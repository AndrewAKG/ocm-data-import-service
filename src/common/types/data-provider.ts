interface DataProviderStatusType {
  IsProviderEnabled: boolean;
  ID: number[];
  Title: string[];
}

interface DataProvider {
  WebsiteURL: string;
  Comments: string;
  DataProviderStatusType: DataProviderStatusType;
  IsRestrictedEdit: boolean;
  IsOpenDataLicensed: boolean;
  IsApprovedImport: boolean;
  License: string;
  DateLastImported: string;
  ID: number;
  Title: string;
}

export { DataProvider, DataProviderStatusType };
