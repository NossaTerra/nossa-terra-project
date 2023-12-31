import { BackofficeHeader } from "~/components/common/headers";
import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";

export const getServerSideProps = redirectGetServerSideProps.Backoffice;

export default function BackofficeUserControlScreen() {
  return (
    <>
      <BackofficeHeader />
      <div className="p-10">
        <h1 className="text-4xl font-bold">Controle de Usuários</h1>
      </div>
    </>
  );
}
