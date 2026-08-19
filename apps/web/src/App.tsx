import {
  curriculumConfigSchema,
  type CurriculumConfig,
} from '@currivia/schema';
import { useMemo } from 'react';

import { s1CurriculumDefinition } from '../../../curricula/hdm/mi7/sose2025/curriculum';
import { AppShell } from './components/AppShell';
import { Onboarding } from './components/Onboarding';
import { Planner } from './components/Planner';
import { SourceDetails } from './components/SourceDetails';
import {
  InvalidConfigurationPage,
  InvalidStoragePage,
  LoadingPage,
} from './components/StatePages';
import { IndexedDbPersonalPlanRepository } from './persistence/indexedDbPersonalPlanRepository';
import type { PersonalPlanRepository } from './persistence/personalPlanRepository';
import { PlanProvider } from './plan/PlanContext';
import { usePlan } from './plan/usePlan';
import { useRoute } from './routes';

const parsedConfig = curriculumConfigSchema.safeParse(s1CurriculumDefinition);

function RoutedApp({ config }: { config: CurriculumConfig }) {
  const route = useRoute();
  const { loadState } = usePlan();

  if (loadState === 'loading') return <LoadingPage />;
  if (loadState === 'invalid') return <InvalidStoragePage />;

  if (route.name === 'planner') return <Planner config={config} />;
  if (route.name === 'source') {
    return <SourceDetails config={config} itemId={route.itemId} />;
  }
  return <Onboarding config={config} />;
}

export function App({ repository }: { repository?: PersonalPlanRepository }) {
  const config = parsedConfig.success ? parsedConfig.data : null;
  const activeRepository = useMemo(
    () =>
      repository ??
      (config ? new IndexedDbPersonalPlanRepository(config) : undefined),
    [config, repository],
  );

  return (
    <AppShell>
      {!config || !activeRepository ? (
        <InvalidConfigurationPage />
      ) : (
        <PlanProvider config={config} repository={activeRepository}>
          <RoutedApp config={config} />
        </PlanProvider>
      )}
    </AppShell>
  );
}
