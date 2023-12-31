import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";

export const getServerSideProps = redirectGetServerSideProps.BuyerOnly;

export default function MyListingsScreen() {
  return (
    <div>
      <p>Meus Anúncios</p>
    </div>
  );
}
