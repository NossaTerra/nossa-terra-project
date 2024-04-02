import { type GetServerSidePropsContext, type GetServerSideProps } from "next";
import { auth } from "./lucia";
import { getInitialRoute } from "./getInitialRoute";
import { type Role, PermittedRoles } from "../../types/user.type";
import { z, type ZodEnum } from "zod";

const getUser = async (context: GetServerSidePropsContext) => {
  const { req, res } = context;

  const authRequest = auth.handleRequest({ req, res });
  const session = await authRequest.validate();
  return session?.user ?? null;
};

const redirectSignIn = (async (context) => {
  return {
    redirect: {
      destination: `/login?redirect=${encodeURIComponent(context.resolvedUrl)}`,
      permanent: false,
    },
  };
}) satisfies GetServerSideProps;

const NoAuthOnly = (async (context) => {
  const user = await getUser(context);
  if (user) {
    return {
      redirect: {
        destination: getInitialRoute(user),
        permanent: false,
      },
    };
  }
  return { props: {} };
}) satisfies GetServerSideProps;

const MaybeAuthed = (async (context) => {
  const user = await getUser(context);
  return { props: { user } };
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
  NoAuthOnly,
  MaybeAuthed,
  Common: Authed(z.enum(PermittedRoles.Common)),
  BuyerOnly: Authed(z.enum(PermittedRoles.BuyerOnly)),
  Backoffice: Authed(z.enum(PermittedRoles.Backoffice)),
  Admin: Authed(z.enum(PermittedRoles.Admin)),
} as const;
