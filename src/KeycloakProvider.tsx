import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import keycloak from './keycloak';
import type { KeycloakTokenParsed, UserProfile } from './types';

type Ctx = {
  initialized: boolean;
  authenticated: boolean;
  profile: UserProfile | null;
  sessionExpired: boolean;
  login: () => void;
  logout: () => void;
  hasRealmRole: (role: string) => boolean;
};

const KeycloakContext = createContext<Ctx | undefined>(undefined);

function readProfile(): UserProfile | null {
  const t = keycloak.tokenParsed as KeycloakTokenParsed | undefined;
  if (!t) return null;
  const clientId = keycloak.clientId ?? '';
  const fullName = t.name ?? [t.given_name, t.family_name].filter(Boolean).join(' ').trim();
  return {
    username: t.preferred_username ?? '',
    name: fullName,
    email: t.email ?? '',
    realmRoles: t.realm_access?.roles ?? [],
    clientRoles: t.resource_access?.[clientId]?.roles ?? [],
  };
}

export function KeycloakProvider({ children }: { children: ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    keycloak.onAuthSuccess = () => {
      setAuthenticated(true);
      setProfile(readProfile());
      setSessionExpired(false);
    };
    keycloak.onAuthLogout = () => {
      setAuthenticated(false);
      setProfile(null);
    };
    keycloak.onAuthRefreshSuccess = () => setProfile(readProfile());
    keycloak.onTokenExpired = () => {
      keycloak.updateToken(30).catch(() => {
        setSessionExpired(true);
        setAuthenticated(false);
        setProfile(null);
      });
    };

    keycloak
      .init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
        checkLoginIframe: false,
      })
      .then((ok) => {
        setAuthenticated(ok);
        if (ok) setProfile(readProfile());
      })
      .catch((e) => console.error('keycloak init failed', e))
      .finally(() => setInitialized(true));
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    const id = window.setInterval(() => {
      keycloak.updateToken(30).catch(() => {
        setSessionExpired(true);
        setAuthenticated(false);
        setProfile(null);
      });
    }, 10_000);
    return () => window.clearInterval(id);
  }, [authenticated]);

  const value: Ctx = {
    initialized,
    authenticated,
    profile,
    sessionExpired,
    login: () => keycloak.login(),
    logout: () => keycloak.logout({ redirectUri: window.location.origin }),
    hasRealmRole: (r) => keycloak.hasRealmRole(r),
  };

  return <KeycloakContext.Provider value={value}>{children}</KeycloakContext.Provider>;
}

export function useKeycloak() {
  const ctx = useContext(KeycloakContext);
  if (!ctx) throw new Error('useKeycloak must be used within KeycloakProvider');
  return ctx;
}
