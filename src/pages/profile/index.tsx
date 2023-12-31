import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";

export const getServerSideProps = redirectGetServerSideProps.Private;

export default function ProfileScreen() {
  return (
    <div>
      <p>ProfileScreen</p>
    </div>
  );
}
