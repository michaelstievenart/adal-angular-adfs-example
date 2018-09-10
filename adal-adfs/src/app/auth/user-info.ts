export interface UserInfo {
  authenticated: boolean;
  userName: string;
  profile: Profile;
}

interface Profile {
  given_name: string;
  family_name: string;
  roles: string [];
}
