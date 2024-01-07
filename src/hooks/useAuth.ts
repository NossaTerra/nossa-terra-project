import { useRouter } from "next/router";
import { useCallback } from "react";
import { getInitialRoute } from "~/server/api/auth/getInitialRoute";
import { type RouterInputs, api } from "~/utils/api";

export function useAuth() {
  const router = useRouter();

  const loginApi = api.auth.login.useMutation();
  const login = useCallback(
    async ({ ...args }: RouterInputs["auth"]["login"]) => {
      const { user } = await loginApi.mutateAsync({ ...args });

      const redirect = router.query.redirect;
      if (redirect && typeof redirect === "string") {
        await router.replace(redirect);
      } else {
        await router.replace(getInitialRoute(user));
      }
    },
    [loginApi, router],
  );

  const logoutApi = api.auth.logout.useMutation();
  const logout = useCallback(async () => {
    await logoutApi.mutateAsync();
    await router.replace("/");
  }, [logoutApi, router]);

  return {
    login,
    logout,
  };
}
