import { useRouter } from "next/router";
import { useEffect, useCallback, useMemo } from "react";
import { create } from "zustand";
import type { ChooseRoleFields } from "./index.page";
import { type OAuthAccountData } from "./account-data/oauth-account";
import { type AccountData } from "./account-data/normal-account";

export type SignUpQueryParams = {
  oauth_provider?: "google";

  username?: string;
  email?: string;
  picture?: string;
};

export function makeSignUpQueryParams(record: SignUpQueryParams) {
  return Object.entries(record)
    .filter(([, value]) => value !== undefined)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value ?? "")}`,
    )
    .join("&");
}

function useSignUpQueryParams(): SignUpQueryParams {
  const {
    query: {
      oauth_provider,

      username,
      email,
      picture,
    },
  } = useRouter();

  return {
    oauth_provider: oauth_provider === "google" ? oauth_provider : undefined,

    username: Array.isArray(username) ? username.at(0) : username,
    email: Array.isArray(email) ? email.at(0) : email,
    picture: Array.isArray(picture) ? picture.at(0) : picture,
  };
}

export interface SignUpStore {
  role?: ChooseRoleFields["role"];
  accountData?:
    | ({
        isOAuth: true;
      } & OAuthAccountData)
    | ({
        isOAuth: false;
      } & AccountData);
}

const useSignUpStore = create<SignUpStore>(() => ({}));

export function useSignUpState() {
  const queryParams = useSignUpQueryParams();
  const signUpStore = useSignUpStore();

  const router = useRouter();

  const isOAuth = !!queryParams.oauth_provider;

  const isValidState = useMemo(() => {
    if (!queryParams.email) {
      return false;
    }

    const noRoleRoutes = ["/signup"];
    if (!signUpStore.role && !noRoleRoutes.includes(router.pathname)) {
      return false;
    }

    const noAccountDataRoutes = [...noRoleRoutes, "/signup/account-data"];
    if (
      !signUpStore.accountData &&
      !noAccountDataRoutes.includes(router.pathname)
    ) {
      return false;
    }

    return true;
  }, [
    queryParams.email,
    router.pathname,
    signUpStore.accountData,
    signUpStore.role,
  ]);

  useEffect(() => {
    if (!isValidState) {
      void router.replace("/login");
    }
  }, [isValidState, router]);

  const chooseRole = useCallback(
    (role: NonNullable<SignUpStore["role"]>) => {
      useSignUpStore.setState({ role });
      void router.push({
        pathname: "/signup/account-data",
        query: router.query,
      });
    },
    [router],
  );

  const setAccountData = useCallback(
    (accountData: NonNullable<SignUpStore["accountData"]>) => {
      useSignUpStore.setState({ accountData });
      void router.push({
        pathname: "/signup/profile-data",
        query: router.query,
      });
    },
    [router],
  );

  return {
    isOAuth,
    ...signUpStore,
    ...queryParams,

    chooseRole,
    setAccountData,
  };
}
