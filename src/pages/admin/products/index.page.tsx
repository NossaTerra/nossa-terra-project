import { type InferGetServerSidePropsType } from "next";
import { BackofficeHeader } from "~/components/common/headers";
import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";

export const getServerSideProps = redirectGetServerSideProps.Admin;
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function ProductsScreen({ user }: Props) {
  return (
    <>
      <BackofficeHeader user={user} />
      <div className="p-10">
        <h1 className="text-4xl font-bold">Produtos</h1>
      </div>
    </>
  );
}
