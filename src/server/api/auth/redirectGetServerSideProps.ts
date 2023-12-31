import { type GetServerSidePropsContext, type GetServerSideProps } from "next";
import { auth } from "./lucia";
import { InitialRoute } from "./initialRoutes";

const getUser = async (context: GetServerSidePropsContext) => {
  const { req, res } = context;

  const authRequest = auth.handleRequest({ req, res });
  const session = await authRequest.validate();
  return session?.user ?? null;
};

const redirectSignIn = (async (context) => {
  return {
    redirect: {
      destination: `/?redirect=${encodeURIComponent(context.resolvedUrl)}`,
      permanent: false,
    },
  };
}) satisfies GetServerSideProps;

const Public = (async (context) => {
  const user = await getUser(context);
  if (user) {
    return {
      redirect: {
        destination:
          user.role === "backoffice"
            ? InitialRoute.backoffice
            : InitialRoute.normalUser,
        permanent: false,
      },
    };
  }
  return { props: {} };
}) satisfies GetServerSideProps;

const Private = (async (context) => {
  const user = await getUser(context);
  if (!user) {
    return redirectSignIn(context);
  }
  if (user.role === "backoffice") {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user: {
        ...user,
        role: user.role,
      },
    },
  };
}) satisfies GetServerSideProps;

const BuyerOnly = (async (context) => {
  const user = await getUser(context);
  if (!user) {
    return redirectSignIn(context);
  }
  if (user.role !== "buyer") {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user: {
        ...user,
        role: user.role,
      },
    },
  };
}) satisfies GetServerSideProps;

const Backoffice = (async (context) => {
  const user = await getUser(context);
  if (!user) {
    return redirectSignIn(context);
  }
  if (user.role !== "backoffice") {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user: {
        ...user,
        role: user.role,
      },
    },
  };
}) satisfies GetServerSideProps;

export const redirectGetServerSideProps = {
  Public,
  Private,
  BuyerOnly,
  Backoffice,
} as const;
