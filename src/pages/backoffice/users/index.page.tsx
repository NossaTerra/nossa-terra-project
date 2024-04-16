import { type InferGetServerSidePropsType } from "next";
import { AppHeader } from "~/components/common/headers";
import { UserTable } from "./components/user-table";
import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";

export const getServerSideProps = redirectGetServerSideProps.Backoffice;
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function BackofficeUserControlScreen({ user }: Props) {
  return (
    <>
      <AppHeader user={user} />
      <div className="p-10">
        <h1 className="text-4xl font-bold">Controle de Usuários</h1>
        <div className="pt-10">
          <UserTable />
        </div>
      </div>
    </>
  );
}
