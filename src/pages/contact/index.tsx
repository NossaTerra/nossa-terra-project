import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";

export const getServerSideProps = redirectGetServerSideProps.Private;

export default function ContactScreen() {
  return (
    <div>
      <p>ContactScreen</p>
    </div>
  );
}
