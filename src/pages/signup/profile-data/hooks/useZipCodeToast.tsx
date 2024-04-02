import { useId, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import React from "react";
import Image from "next/image";
import { useInvokeCallbackOnce } from "~/hooks/useInvokeCallbackOnce";

const useZipCodeToast = () => {
  const zipCodeToastRef = useRef("");
  const key = useId();

  const zipCodeToast = useCallback(() => {
    const zipCodeToastId = toast.custom(
      (t) => (
        <div
          key={key}
          className={`${t.visible ? "animate-enter" : "animate-leave"
            } pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5`}
        >
          <div className="w-0 flex-1 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <Image
                  src="/images/logo-no-background.png"
                  width={45}
                  className="rounded-full"
                  height={50}
                  priority
                  alt="Nossa terra logo"
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Caso more na zona rural
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Digite um <strong>CEP</strong> Qualquer válido de seu
                  município, o mesmo vale para endereço
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.remove(zipCodeToastRef.current)}
              className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-headingPrimary focus:outline-none focus:ring-2 focus:ring-headingPrimary"
            >
              Fechar
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
    zipCodeToastRef.current = zipCodeToastId;
  }, [key]);

  useInvokeCallbackOnce({
    callback: zipCodeToast,
    cleanUp: () => {
      toast.remove(zipCodeToastRef.current);
    },
  });

  return zipCodeToastRef;
};

export default useZipCodeToast;
