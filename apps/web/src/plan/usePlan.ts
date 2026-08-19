import { useContext } from 'react';

import { PlanContext, type PlanContextValue } from './planContextValue';

export function usePlan(): PlanContextValue {
  const value = useContext(PlanContext);
  if (!value)
    throw new Error('usePlan muss innerhalb des PlanProvider laufen.');
  return value;
}
