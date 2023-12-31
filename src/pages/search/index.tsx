import { Button } from "~/components/ui/button";
import { useAuth } from "~/hooks/useAuth";
import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";
import { api } from "~/utils/api";

export const getServerSideProps = redirectGetServerSideProps.Private;

// TODO: implement proper SearchScreen
// For now it's just an auth showcase
export default function SearchScreen() {
  const { data: user } = api.auth.getUser.useQuery();
  const { logout } = useAuth();

  if (user) {
    return (
      <div>
        <h1 className="text-xl font-bold">You are Logged In!</h1>
        <p>Your current user is:</p>
        <div className="m-4 flex w-fit flex-col gap-2 rounded-md bg-blue-200 p-4">
          <h2 className="py-2 text-lg font-bold">{user.name}</h2>
          <p>{user.email}</p>
          <p>
            ROLE: <span className="font-bold">{user.role}</span>
          </p>
          <p>{user.isActive ? "✅ isActive" : "❌ NotActive"}</p>
        </div>
        ) <Button onClick={logout}>Log Out</Button>
      </div>
    );
  }

  return (
    <div>
      <p>You are not LOGGED IN</p>
    </div>
  );
}
