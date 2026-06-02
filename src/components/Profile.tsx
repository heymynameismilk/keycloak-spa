import {
  Card,
  CardBody,
  CardTitle,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Label,
  LabelGroup,
} from '@patternfly/react-core';
import { useKeycloak } from '../KeycloakProvider';

function roles(items: string[], color: 'blue' | 'green') {
  if (items.length === 0) return '—';
  return (
    <LabelGroup>
      {items.map((r) => (
        <Label key={r} color={color}>{r}</Label>
      ))}
    </LabelGroup>
  );
}

export function Profile() {
  const { profile } = useKeycloak();
  if (!profile) return null;

  const rows: Array<[string, React.ReactNode]> = [
    ['Имя', profile.name || profile.username],
    ['Логин', profile.username],
    ['Email', profile.email || '—'],
    ['Realm-роли', roles(profile.realmRoles, 'blue')],
    ['Client-роли', roles(profile.clientRoles, 'green')],
  ];

  return (
    <Card>
      <CardTitle>Профиль пользователя</CardTitle>
      <CardBody>
        <DescriptionList>
          {rows.map(([term, desc]) => (
            <DescriptionListGroup key={term}>
              <DescriptionListTerm>{term}</DescriptionListTerm>
              <DescriptionListDescription>{desc}</DescriptionListDescription>
            </DescriptionListGroup>
          ))}
        </DescriptionList>
      </CardBody>
    </Card>
  );
}
