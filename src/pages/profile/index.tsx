import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { type InferGetServerSidePropsType } from "next";
import { AppHeader } from "~/components/common/headers";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/hooks/useAuth";
import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";

export const getServerSideProps = redirectGetServerSideProps.Common;
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function ProfileScreen({ user }: Props) {
  const { logout } = useAuth();

  return (
    <>
      <AppHeader user={user} />
      <div className="p-10">
        <h1 className="text-4xl font-bold">Meu Perfil</h1>
        <div className="m-4 flex w-fit flex-col gap-2 rounded-md bg-blue-200 p-4">
          <h2 className="py-2 text-lg font-bold">{user.name}</h2>
          <p>{user.email}</p>
          <p>
            ROLE: <span className="font-bold">{user.role}</span>
          </p>
          <p>{user.isActive ? "✅ isActive" : "❌ NotActive"}</p>
        </div>
        {user.avatarImage && (
          <Avatar>
            <AvatarImage
              className="h-40 w-40 rounded-full border-2 object-cover"
              src={user.avatarImage}
            />
          </Avatar>
        )}
        <Button onClick={logout}>Log Out</Button>
      </div>
    </>
  );
}
