import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
  Button,
} from '@patternfly/react-core';
import LockIcon from '@patternfly/react-icons/dist/esm/icons/lock-icon';
import { useKeycloak } from '../KeycloakProvider';

export function ProtectedRoute({ role, children }: { role: string; children: ReactNode }) {
  const { initialized, authenticated, hasRealmRole, login } = useKeycloak();

  if (!initialized) return null;

  if (!authenticated) {
    return (
      <EmptyState>
        <EmptyStateHeader
          titleText="Требуется вход"
          headingLevel="h2"
          icon={<EmptyStateIcon icon={LockIcon} />}
        />
        <EmptyStateBody>Этот раздел доступен только авторизованным пользователям.</EmptyStateBody>
        <Button variant="primary" onClick={login}>Войти</Button>
      </EmptyState>
    );
  }

  if (!hasRealmRole(role)) return <Navigate to="/forbidden" replace />;

  return <>{children}</>;
}
