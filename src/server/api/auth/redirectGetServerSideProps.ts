import { type GetServerSidePropsContext, type GetServerSideProps } from "next";
import { auth } from "./lucia";
import { InitialRoute } from "./initialRoutes";
import { RoleTypeSchema, type Role } from "./types";
import { type ZodEnum } from "zod";

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

const Authed = <TRoles extends [Role, ...Role[]]>(
  roleParser: ZodEnum<TRoles>,
) => {
  return (async (context) => {
    const user = await getUser(context);
    if (!user) {
      return redirectSignIn(context);
    }

    const roleParse = roleParser.safeParse(user.role);
    if (!roleParse.success) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        user: {
          ...user,
          role: roleParse.data,
        },
      },
    };
  }) satisfies GetServerSideProps;
};

export const redirectGetServerSideProps = {
  Public,
  Common: Authed(RoleTypeSchema.Common),
  BuyerOnly: Authed(RoleTypeSchema.BuyerOnly),
  Backoffice: Authed(RoleTypeSchema.Backoffice),
} as const;
