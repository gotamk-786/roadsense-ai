import { useEffect } from 'react';

export function useFocusEffect(callback: () => void) {
  useEffect(() => {
    callback();
  }, [callback]);
}
