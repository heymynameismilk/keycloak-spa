import { PageSection, Title, TextContent, Text } from '@patternfly/react-core';
import { useKeycloak } from '../KeycloakProvider';
import { Profile } from '../components/Profile';

export function Home() {
  const { authenticated } = useKeycloak();
  return (
    <PageSection>
      <Title headingLevel="h1">Главная</Title>
      {authenticated ? (
        <div style={{ marginTop: '1rem' }}>
          <Profile />
        </div>
      ) : (
        <TextContent>
          <Text component="p">Вы не авторизованы. Используйте кнопку «Войти» в шапке.</Text>
        </TextContent>
      )}
    </PageSection>
  );
}
