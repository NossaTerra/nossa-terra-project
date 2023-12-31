import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";

export const getServerSideProps = redirectGetServerSideProps.Backoffice;

export default function BackofficeAdsScreen() {
  return (
    <div>
      <p>BackofficeAdsScreen</p>
    </div>
  );
}
