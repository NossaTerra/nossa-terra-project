import { type InferGetServerSidePropsType } from "next";
import { AppHeader } from "~/components/common/headers";
import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";

export const getServerSideProps = redirectGetServerSideProps.BuyerOnly;
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function MyListingsScreen({ user }: Props) {
  return (
    <>
      <AppHeader user={user} />
      <div className="p-10">
        <h1 className="text-4xl font-bold">Meus Anúncios</h1>
      </div>
    </>
  );
}
