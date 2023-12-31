import { BackofficeHeader } from "~/components/common/headers";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/hooks/useAuth";
import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";

export const getServerSideProps = redirectGetServerSideProps.Backoffice;

export default function BackofficeAdsScreen() {
  const { logout } = useAuth();
  return (
    <>
      <BackofficeHeader />
      <div className="p-10">
        <h1 className="text-4xl font-bold">Anúncios</h1>
        <Button onClick={logout}>Log Out</Button>
      </div>
    </>
  );
}
