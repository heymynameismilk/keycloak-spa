import { PageSection, Title, Card, CardBody, CardTitle } from '@patternfly/react-core';
import { useKeycloak } from '../KeycloakProvider';

export function Secret() {
  const { profile } = useKeycloak();
  return (
    <PageSection>
      <Title headingLevel="h1">Защищённый раздел</Title>
      <Card style={{ marginTop: '1rem' }}>
        <CardTitle>Доступ разрешён</CardTitle>
        <CardBody>
          Привет, {profile?.name || profile?.username}. Эта страница доступна только пользователям с realm-ролью <code>app-user</code>.
        </CardBody>
      </Card>
    </PageSection>
  );
}
