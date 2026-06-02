import {
  PageSection,
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
} from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';

export function Forbidden() {
  return (
    <PageSection>
      <EmptyState>
        <EmptyStateHeader
          titleText="403 — Доступ запрещён"
          headingLevel="h2"
          icon={<EmptyStateIcon icon={ExclamationCircleIcon} color="#c9190b" />}
        />
        <EmptyStateBody>У вас нет необходимой realm-роли для просмотра этого раздела.</EmptyStateBody>
      </EmptyState>
    </PageSection>
  );
}
