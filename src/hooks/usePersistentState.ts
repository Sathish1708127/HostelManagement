import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

const demoMode = import.meta.env.VITE_SUPABASE_MOCK === 'true';

export function usePersistentState<T>(
  key: string,
  initialValue: T,
  persistOutsideDemo = false,
): [T, Dispatch<SetStateAction<T>>] {
  const shouldPersist = demoMode || persistOutsideDemo;
  const [value, setValue] = useState<T>(() => {
    if (!shouldPersist) return initialValue;
    const stored = window.localStorage.getItem(`hostel-pulse:${key}`);
    return stored === null ? initialValue : (JSON.parse(stored) as T);
  });

  useEffect(() => {
    if (shouldPersist) {
      window.localStorage.setItem(`hostel-pulse:${key}`, JSON.stringify(value));
    }
  }, [key, shouldPersist, value]);

  return [value, setValue];
}
