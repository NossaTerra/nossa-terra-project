import { type InferGetServerSidePropsType } from "next";
import { AppHeader } from "~/components/common/headers";
import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";

export const getServerSideProps = redirectGetServerSideProps.Common;
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function ContactScreen({ user }: Props) {
  return (
    <>
      <AppHeader user={user} />
      <div className="p-10">
        <h1 className="text-2xl md:text-4xl font-bold">Contato</h1>
      </div>
    </>
  );
}
