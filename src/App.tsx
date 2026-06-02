import {
  Page,
  Masthead,
  MastheadMain,
  MastheadBrand,
  MastheadContent,
  MastheadToggle,
  PageToggleButton,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Button,
  Nav,
  NavList,
  NavItem,
  PageSidebar,
  PageSidebarBody,
  Spinner,
  Bullseye,
} from '@patternfly/react-core';
import BarsIcon from '@patternfly/react-icons/dist/esm/icons/bars-icon';
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

  const header = (
    <Masthead>
      <MastheadToggle>
        <PageToggleButton variant="plain" aria-label="Global navigation">
          <BarsIcon />
        </PageToggleButton>
      </MastheadToggle>
      <MastheadMain>
        <MastheadBrand>Keycloak SPA</MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <Toolbar>
          <ToolbarContent>
            {authenticated && profile && (
              <ToolbarItem>{profile.name || profile.username}</ToolbarItem>
            )}
            <ToolbarItem align={{ default: 'alignRight' }}>
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

  const sidebar = (
    <PageSidebar>
      <PageSidebarBody>
        <Nav>
          <NavList>
            <NavItem isActive={pathname === '/'} itemId="home">
              <Link to="/">Главная</Link>
            </NavItem>
            <NavItem isActive={pathname === '/secret'} itemId="secret">
              <Link to="/secret">Защищённый раздел</Link>
            </NavItem>
          </NavList>
        </Nav>
      </PageSidebarBody>
    </PageSidebar>
  );

  return (
    <Page header={header} sidebar={sidebar} isManagedSidebar>
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
