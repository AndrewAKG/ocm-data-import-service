interface Permission {
  Level: number;
}

interface Permissions {
  Permissions: Permission[];
  LegacyPermissions: string;
}

interface UserInfo {
  ID: number;
  Username: string;
  ReputationPoints: number;
  ProfileImageURL: string;
}

interface UserProfile extends UserInfo {
  Profile: string;
  Location: string;
  WebsiteURL: string;
  Permissions: Permissions;
  DateCreated: string;
  DateLastLogin: string;
  IsProfilePublic: boolean;
  Latitude: number;
  Longitude: number;
  EmailAddress: string;
}

export { UserInfo, UserProfile };
