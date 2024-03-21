import { useEffect, useRef, useState } from "react";

const DEFAULT_DELAY = 300;

interface QueuedDebounce<T> {
  value: T;
  timer: NodeJS.Timeout;
}

/**
 * A hook that returns a debounced value of the given input value.
 * This hook delays updating the returned value until after a specified delay period has passed
 * without any new updates to the input value. It's useful for delaying operations like
 * API calls or search queries that should only happen after the input value has stabilized.
 */
export function useDebouncedValue<T>({
  value,
  delay = DEFAULT_DELAY,
}: {
  value: T;
  delay?: number;
}) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const queuedDebounceRef = useRef<QueuedDebounce<T> | null>(null);

  useEffect(() => {
    if (
      value !== debouncedValue &&
      value !== queuedDebounceRef.current?.value
    ) {
      if (queuedDebounceRef.current) {
        clearTimeout(queuedDebounceRef.current.timer);
      }

      queuedDebounceRef.current = {
        value,
        timer: setTimeout(() => {
          setDebouncedValue(value);
          queuedDebounceRef.current = null;
        }, delay),
      };
    }
  }, [debouncedValue, delay, value]);

  useEffect(() => {
    return () => {
      if (queuedDebounceRef.current) {
        clearTimeout(queuedDebounceRef.current.timer);
      }
    };
  }, []);

  return debouncedValue;
}
