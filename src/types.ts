export type UserProfile = {
  username: string;
  name: string;
  email: string;
  realmRoles: string[];
  clientRoles: string[];
};

export type KeycloakTokenParsed = {
  preferred_username?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  realm_access?: { roles: string[] };
  resource_access?: Record<string, { roles: string[] }>;
  exp?: number;
};
