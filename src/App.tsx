import {
  Page,
  Masthead,
  MastheadMain,
  MastheadBrand,
  MastheadContent,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Button,
  Nav,
  NavList,
  NavItem,
  Spinner,
  Bullseye,
} from '@patternfly/react-core';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useKeycloak } from './KeycloakProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SessionExpiredAlert } from './components/SessionExpiredAlert';
import { Home } from './pages/Home';
import { Secret } from './pages/Secret';
import { Forbidden } from './pages/Forbidden';

export default function App() {
  const { initialized, authenticated, profile, login, logout } = useKeycloak();
  const { pathname } = useLocation();

  if (!initialized) {
    return (
      <Bullseye style={{ height: '100vh' }}>
        <Spinner aria-label="Загрузка" />
      </Bullseye>
    );
  }

  const nav = (
    <Nav variant="horizontal">
      <NavList>
        <NavItem isActive={pathname === '/'} itemId="home">
          <Link to="/">Главная</Link>
        </NavItem>
        <NavItem isActive={pathname === '/secret'} itemId="secret">
          <Link to="/secret">Защищённый раздел</Link>
        </NavItem>
      </NavList>
    </Nav>
  );

  const header = (
    <Masthead>
      <MastheadMain>
        <MastheadBrand>Keycloak SPA</MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>{nav}</ToolbarItem>
            {authenticated && profile && (
              <ToolbarItem align={{ default: 'alignRight' }}>
                {profile.name || profile.username}
              </ToolbarItem>
            )}
            <ToolbarItem
              align={authenticated && profile ? undefined : { default: 'alignRight' }}
            >
              {authenticated ? (
                <Button variant="secondary" onClick={logout}>Выйти</Button>
              ) : (
                <Button variant="primary" onClick={login}>Войти</Button>
              )}
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </MastheadContent>
    </Masthead>
  );

  return (
    <Page header={header}>
      <div style={{ padding: '1rem 1rem 0' }}>
        <SessionExpiredAlert />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/secret"
          element={
            <ProtectedRoute role="app-user">
              <Secret />
            </ProtectedRoute>
          }
        />
        <Route path="/forbidden" element={<Forbidden />} />
      </Routes>
    </Page>
  );
}
