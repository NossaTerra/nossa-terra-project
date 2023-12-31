import { useEffect, useRef } from "react";

interface Props {
  callback: () => void;
  shouldInvoke?: boolean;
}

export const useInvokeCallbackOnce = ({
  callback,
  shouldInvoke = true,
}: Props) => {
  const alreadyFiredRef = useRef(false);

  useEffect(() => {
    if (shouldInvoke && !alreadyFiredRef.current) {
      alreadyFiredRef.current = true;
      callback();
    }
  }, [shouldInvoke, callback]);
};
