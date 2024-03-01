import { useEffect } from "react";
import { useRouter } from "next/router";

const useBeforeUnloadAndPopState = (pageKey?: string) => {
  const router = useRouter();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ""; // Required for Chrome
    };

    const handleBeforePopState = () => true;

    window.addEventListener("beforeunload", handleBeforeUnload);
    router.beforePopState(handleBeforePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      router.beforePopState(() => true);
    };
  }, [router, pageKey]);
};

export default useBeforeUnloadAndPopState;
