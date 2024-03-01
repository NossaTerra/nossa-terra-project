import { useEffect, useRef } from "react";

interface Props {
  callback: () => void;
  cleanUp?: () => void;
  shouldInvoke?: boolean;
}

export const useInvokeCallbackOnce = ({
  cleanUp,
  callback,
  shouldInvoke = true,
}: Props) => {
  const alreadyFiredRef = useRef(false);

  useEffect(() => {
    if (shouldInvoke && !alreadyFiredRef.current) {
      alreadyFiredRef.current = true;
      callback();
    }
    if (!!cleanUp && !shouldInvoke) {
      return () => {
        cleanUp();
      };
    }
  }, [shouldInvoke, callback, cleanUp]);
};
