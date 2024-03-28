import { useRouter } from "next/router";
import { useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { getInitialRoute } from "~/server/api/auth/getInitialRoute";
import { type RouterInputs, api } from "~/utils/api";

export function useAuth() {
  const router = useRouter();
  const isLoggingIn = useRef(false);
  const isLoggingOut = useRef(false);

  const loginApi = api.auth.login.useMutation({
    onError() {
      toast.error("Erro ao entrar no Nossa Terra");
    },
  });
  const login = useCallback(
    async ({ ...args }: RouterInputs["auth"]["login"]) => {
      isLoggingIn.current = true;
      try {
        const { user } = await loginApi.mutateAsync({ ...args });

        const redirect = router.query.redirect;
        if (redirect && typeof redirect === "string") {
          await router.replace(redirect);
        } else {
          await router.replace(getInitialRoute(user));
        }
      } finally {
        isLoggingIn.current = false;
      }
    },
    [loginApi, router],
  );

  const logoutApi = api.auth.logout.useMutation({
    onError: () => {
      toast.error("Erro ao sair do Nossa Terra");
    },
  });

  const logout = useCallback(async () => {
    isLoggingOut.current = true;
    try {
      await logoutApi.mutateAsync();
      await router.replace("/");
    } catch {
      console.log("Error while logging out");
    } finally {
      isLoggingOut.current = false;
    }
  }, [logoutApi, router]);

  return {
    login,
    logout,
    loginLoading: loginApi.isLoading,
    logoutLoading: logoutApi.isLoading,
  };
}
