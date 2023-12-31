import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";

export const getServerSideProps = redirectGetServerSideProps.Backoffice;

export default function BackofficeUsersScreen() {
  return (
    <div>
      <p>BackofficeUsersScreen</p>
    </div>
  );
}
