import { type InferGetServerSidePropsType } from "next";
import { AppHeader } from "~/components/common/headers";
import { Button, type ButtonProps } from "~/components/ui/button";
import { useAuth } from "~/hooks/useAuth";
import { Brush, LogOut, ArrowLeftIcon } from "lucide-react";

import toast from "react-hot-toast";
import { getBuyerDiffObject, getSellerDiffObject } from "~/utils/formHelpers";
import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";
import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Direction,
  transition,
  variants,
} from "~/animation/horizontalCrossfade";
import {
  BuyerForm,
  type BuyerFormProps,
} from "~/pages/signup/profile-data/buyer-form";
import {
  SellerForm,
  type SellerFormProps,
} from "~/pages/signup/profile-data/seller-form";

import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import AdsCarrousel from "~/components/common/AdsCarrousel";
import { api } from "~/utils/api";
import { awaitDiffConfirmationDialog, DiffDialog } from "./DiffDialog";
import { type User } from "~/server/types/user.type";
import { scrollToTopAsync } from "~/utils/scroll";
import { type ClassNameProps, cn } from "~/utils/ui";
import { UserInfoCard } from "~/components/common/UserInfoCard";

export const getServerSideProps = redirectGetServerSideProps.Common;
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function ProfileScreen({ user: ssrUser }: Props) {
  const rawUserData = api.auth.getUser.useQuery()?.data ?? ssrUser;

  const user = useMemo(() => {
    const nonNullableUserProps = {} as Record<string, unknown>;
    Object.entries(rawUserData).forEach(([key, value]) => {
      nonNullableUserProps[key] = value ?? undefined;
    });
    return nonNullableUserProps as NonNullable<typeof rawUserData>;
  }, [rawUserData]);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const direction = isEditingProfile ? Direction.Right : Direction.Left;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const keyUserChange = useMemo(() => crypto.randomUUID(), [user]);

  const formProps = useMemo(() => {
    return {
      defaultValues: user,
    };
  }, [user]);

  const apiUtils = api.useUtils();
  const editBuyer = api.profile.editBuyer.useMutation({
    onSuccess: async () => {
      await apiUtils.auth.getUser.invalidate();
    },
  });

  const onBuyerFormSubmit: BuyerFormProps["onSuccess"] = useCallback(
    async ({ data, form }) => {
      const diffObject = getBuyerDiffObject(form, user);
      if (Object.entries(diffObject).length === 0) {
        return;
      }
      await awaitDiffConfirmationDialog(diffObject);
      try {
        await editBuyer.mutateAsync({
          id: user.id,
          data,
        });
        toast.success("Alterações realizadas com sucesso");
        await scrollToTopAsync(500);
        setIsEditingProfile(false);
      } catch (e) {
        toast.error("Erro ao realizar alterações");
      }
    },
    [editBuyer, user],
  );

  const editSeller = api.profile.editSeller.useMutation({
    onSuccess: async () => {
      await apiUtils.auth.getUser.invalidate();
    },
  });
  const onSellerFormSubmit: SellerFormProps["onSuccess"] = useCallback(
    async ({ data, form }) => {
      const diffObject = getSellerDiffObject(form, user);
      if (Object.entries(diffObject).length === 0) {
        return;
      }
      await awaitDiffConfirmationDialog(diffObject);
      try {
        await editSeller.mutateAsync({
          id: user.id,
          data,
        });
        toast.success("Alterações realizadas com sucesso");
      } catch (e) {
        toast.error("Erro ao realizar alterações");
      }
    },
    [editSeller, user],
  );

  const diffDialogButtonProps = useMemo(
    () => ({
      isLoading: editSeller.isLoading || editBuyer.isLoading,
    }),
    [editBuyer.isLoading, editSeller.isLoading],
  );

  const submitButtonProps: ButtonProps = useMemo(
    () => ({
      variant: "default",
      children: "Salvar Alterações",
    }),
    [],
  );

  const [isDirty, setIsDirty] = useState(false);

  return (
    <>
      <DiffDialog buttonProps={diffDialogButtonProps} />

      <AppHeader user={user} />
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={isEditingProfile.toString()}
          initial="enter"
          animate="center"
          exit="exit"
          custom={direction}
          variants={variants}
          transition={transition}
          className="flex grow flex-col justify-between px-6 md:px-14"
        >
          <div>
            {user.role === "seller" && (
              <>
                <div className="flex flex-row justify-between ">
                  <h1 className="mb-8 mt-10 text-2xl font-bold md:text-4xl">
                    Meu Perfil
                  </h1>
                  <LogOutButton className="mt-10" />
                </div>

                {isDirty && <PingHasUnsavedEditing />}
                <SellerForm
                  key={keyUserChange}
                  className="my-10 md:pl-2"
                  onSuccess={onSellerFormSubmit}
                  formProps={formProps}
                  submitButtonProps={submitButtonProps}
                  onIsDirty={setIsDirty}
                />
              </>
            )}
            {user.role === "buyer" && isEditingProfile && (
              <>
                <Button
                  className="mb-8 gap-3 p-4 text-lg"
                  variant="outline"
                  onClick={() => setIsEditingProfile(false)}
                >
                  <ArrowLeftIcon />
                  Voltar
                </Button>

                {isDirty && <PingHasUnsavedEditing />}
                <BuyerForm
                  key={keyUserChange}
                  className="my-8 md:pl-2"
                  onSuccess={onBuyerFormSubmit}
                  formProps={formProps}
                  submitButtonProps={submitButtonProps}
                  onIsDirty={setIsDirty}
                />
              </>
            )}
            {user.role === "buyer" && !isEditingProfile && (
              <CurrentProfileCardScreen
                key={keyUserChange}
                user={user}
                onEditing={() => setIsEditingProfile(true)}
              />
            )}
          </div>
          <footer className="flex w-full justify-end py-10">
            {user.role === "buyer" && !isEditingProfile && <LogOutButton />}
            {isEditingProfile && <AdsCarrousel className="mt-20" />}
          </footer>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export function CurrentProfileCardScreen({
  user,
  onEditing,
}: {
  onEditing: () => void;
  user: User;
}) {
  return (
    <>
      <h1 className="mt-10 text-2xl font-bold md:text-4xl">Meu Perfil</h1>
      <p className="mb-2 mt-8 text-lg">Seus anúncios aparecem assim...</p>
      <UserInfoCard
        user={user}
        className="max-w-lg border-2 border-black p-8"
        isClickable={false}
      />

      <Button
        onClick={onEditing}
        className="mt-8 bg-black py-4"
        variant="outline"
      >
        <Brush color="white" className="mr-2 inline h-4 w-4" />
        <span className="text-white">Editar Perfil{"\n      "}</span>
      </Button>
    </>
  );
}

export function LogOutButton({ className }: ClassNameProps) {
  const { logout, logoutLoading } = useAuth();

  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <Button
          isLoading={logoutLoading}
          variant="outline"
          className={cn("text-md", className)}
        >
          <LogOut className="mr-1 inline h-6 w-6" />
          Sair
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[80vw] md:w-auto ">
        <DialogHeader>
          <DialogTitle>Sair do Nossa Terra</DialogTitle>
          <DialogDescription className="pt-2">
            Tem certeza que deseja sair do Nossa Terra?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={logout} variant="destructive">
            Sair
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PingHasUnsavedEditing() {
  return (
    <div className="animate-fade-in font-poppins-400 mb-6 mt-4 text-sm ">
      <span className="relative flex h-3 w-3">
        <span className="absolute top-2 inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
        <span className="relative top-2 inline-flex h-3 w-3 rounded-full bg-accent"></span>
      </span>
      <span className="ml-0.5 block px-3 pb-3">
        Clique em salvar alterações para completar edição
      </span>
    </div>
  );
}
