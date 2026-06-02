import { Alert, AlertActionLink } from '@patternfly/react-core';
import { useKeycloak } from '../KeycloakProvider';

export function SessionExpiredAlert() {
  const { sessionExpired, login } = useKeycloak();
  if (!sessionExpired) return null;
  return (
    <Alert
      variant="warning"
      title="Сессия истекла"
      style={{ marginBottom: '1rem' }}
      actionLinks={<AlertActionLink onClick={login}>Войти заново</AlertActionLink>}
    >
      Не удалось обновить токен — выполните вход повторно.
    </Alert>
  );
}
