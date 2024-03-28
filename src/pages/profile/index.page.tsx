import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { type InferGetServerSidePropsType } from "next";
import { AppHeader } from "~/components/common/headers";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/hooks/useAuth";
import Image from "next/image";
import { MapPinIcon, Brush, LogOut, ArrowLeftIcon } from "lucide-react";

import { redirectGetServerSideProps } from "~/server/api/auth/redirectGetServerSideProps";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Direction,
  transition,
  variants,
} from "~/animation/horizontalCrossfade";
import { BuyerForm } from "~/pages/login/LoginRegisterFlow/screens/SecondDataStepBuyerScreen";
import { SellerForm } from "~/pages/login/LoginRegisterFlow/screens/SecondDataStepSellerScreen";
import { generateAvatarColor } from "~/utils/formHelpers";

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

export const getServerSideProps = redirectGetServerSideProps.Common;
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function ProfileScreen({ user }: Props) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const direction = isEditingProfile ? Direction.Left : Direction.Right;
  const showLogoutButton = !isEditingProfile || user.role === "seller";

  return (
    <>
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
                <h1 className="mt-10 mb-8 text-2xl font-bold md:text-4xl">
                  Meu Perfil
                </h1>
                <SellerForm
                  isEditingProfile
                  user={user}
                  className="mb-10 md:pl-2"
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

                <BuyerForm
                  isEditingProfile
                  user={user}
                  className="mb-8 md:pl-2"
                />
              </>
            )}
            {user.role === "buyer" && !isEditingProfile && (
              <CurrentProfileCardScreen
                user={user}
                onEditing={() => setIsEditingProfile(true)}
              />
            )}
          </div>

          <footer className="flex justify-center py-10 lg:justify-end">
            {showLogoutButton && <LogOutButton />}
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
}: Props & { onEditing: () => void }) {
  return (
    <>
      <h1 className="mt-10 text-2xl font-bold md:text-4xl">Meu Perfil</h1>
      <p className="mb-4 mt-6 text-lg">Seus anúncios aparecem assim...</p>
      <UserAnnouncementCard user={user} />
      <Button
        onClick={onEditing}
        className="mt-6 bg-black py-4 md:mt-0 "
        variant="outline"
      >
        <Brush color="white" className="mr-2 inline h-4 w-4" />
        <span className="text-white">Editar Perfil{"\n      "}</span>
      </Button>
    </>
  );
}

export function LogOutButton() {
  const { logout, logoutLoading } = useAuth();

  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <Button isLoading={logoutLoading} variant="ghost" className="text-md">
          <LogOut color="black" className="mr-2 inline h-6 w-6" />
          Sair do Nossa Terra
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

export function UserAnnouncementCard({ user }: Props) {
  const commonPhones = useMemo(() => {
    const phones: string[] = [];

    if (user.phoneUsesWhatsapp === false) {
      phones.push(user.phone);
    }
    if (user.secondaryPhone && user?.secondaryPhoneUsesWhatsapp === false) {
      phones.push(user.secondaryPhone);
    }

    return phones;
  }, [
    user.phone,
    user.phoneUsesWhatsapp,
    user.secondaryPhone,
    user?.secondaryPhoneUsesWhatsapp,
  ]);

  const whatsAppPhones = useMemo(() => {
    const phones: string[] = [];

    if (user.phoneUsesWhatsapp) {
      phones.push(user.phone);
    }
    if (user.secondaryPhone && user?.secondaryPhoneUsesWhatsapp) {
      phones.push(user.secondaryPhone);
    }

    return phones;
  }, [
    user.phone,
    user.phoneUsesWhatsapp,
    user.secondaryPhone,
    user?.secondaryPhoneUsesWhatsapp,
  ]);

  return (
    <div className="md:max-w-2xl md:py-7 ">
      <div className="rounded-lg border-2 border-black p-5">
        <div className="flex space-x-4 md:items-center">
          <Avatar className="flex ">
            <AvatarImage
              className="h-20 w-20 rounded-full border border-slate-800  object-cover md:h-24 md:w-24"
              src={user.avatarImage}
            />
            <AvatarFallback
              style={{ backgroundColor: `${generateAvatarColor(user.name)}` }}
              className={`flex h-20 w-20 items-center justify-center rounded-full border border-slate-200 md:h-24 md:w-24`}
            >
              <span className={`font-poppins-700 text-2xl text-white`}>
                {user.name?.substring(0, 2).toLocaleUpperCase()}
              </span>
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-3 pl-3 capitalize md:pl-10">
            <div className="ml-0.5 mt-0.5 flex items-start justify-start md:ml-0 ">
              <div className="flex flex-col items-start">
                <span className=" mb-1 w-40 break-all text-lg font-bold lg:w-96">
                  {user?.name}
                </span>
              </div>
            </div>
            <div className="flex-col md:flex md:flex-row">
              <div className="flex">
                <MapPinIcon className="h-5 w-5 text-current" />
                <span className="ml-3 w-36 text-sm text-gray-500">
                  {user.city} - {user.province}{" "}
                </span>
              </div>
              {user.instagram && (
                <div className=" mt-4 flex items-start justify-start md:ml-2 md:mt-0">
                  <Image
                    priority
                    src="/images/icons/instagram-app-icon.svg"
                    height={19}
                    width={19}
                    alt="Instagram Icon"
                    className="md:ml-1"
                  />
                  <div className="ml-3 flex flex-col">
                    <span className="w-38 break-all text-sm">
                      {user.instagram}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col items-start gap-3 md:flex md:flex-row md:gap-10">
              {whatsAppPhones.length > 0 && (
                <div className="mt-1 flex items-start justify-center">
                  <Image
                    priority
                    className="mt-0.5"
                    src="/images/icons/whatsapp-icon.svg"
                    height={20}
                    width={20}
                    alt="Phone Icon"
                  />
                  <div className="ml-3 flex flex-col">
                    {whatsAppPhones.map((phone, index) => (
                      <span key={index} className="text-sm">
                        {phone}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {commonPhones.length > 0 && (
                <div className="mt-1 flex items-start justify-center">
                  <Image
                    priority
                    className="mt-0.5"
                    src="/images/icons/phone-icon.svg"
                    height={20}
                    width={20}
                    alt="Phone Icon"
                  />
                  <div className="ml-3 flex flex-col">
                    {commonPhones.map((phone, index) => (
                      <span key={index} className="text-sm">
                        {phone}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
