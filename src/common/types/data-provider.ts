interface DataProviderStatusType {
  IsProviderEnabled: boolean;
  ID: number;
  Title: string;
}

interface DataProvider {
  WebsiteURL: string | null;
  Comments: string | null;
  DataProviderStatusType: DataProviderStatusType;
  IsRestrictedEdit: boolean;
  IsOpenDataLicensed: boolean;
  IsApprovedImport: boolean;
  License: string | null;
  DateLastImported: string | null;
  ID: number;
  Title: string;
}

export { DataProvider, DataProviderStatusType };
