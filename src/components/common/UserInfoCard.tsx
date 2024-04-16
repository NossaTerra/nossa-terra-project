import { type ClassNameProps, cn } from "~/utils/ui";
import Image from "next/image";
import { MapPinIcon } from "lucide-react";
import { type User as PrismaUser } from "@prisma/client";
import { type User } from "~/server/types/user.type";
import { useMemo } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { generateAvatarColor } from "~/utils/formHelpers";
import Link from "next/link";
import React from "react";

export function UserInfoCard({
  user,
  showBlured = false,
  isClickable = true,
  className,
}: {
  user: User | PrismaUser;
  showBlured?: boolean;
  isClickable?: boolean;
} & ClassNameProps) {
  const commonPhones = useMemo(() => {
    const phones: string[] = [];

    if (user?.phoneUsesWhatsapp === false) {
      phones.push(user.phone);
    }
    if (user.secondaryPhone && user?.secondaryPhoneUsesWhatsapp === false) {
      phones.push(user.secondaryPhone);
    }

    return phones;
  }, [
    user?.phone,
    user?.phoneUsesWhatsapp,
    user?.secondaryPhone,
    user?.secondaryPhoneUsesWhatsapp,
  ]);

  const whatsAppPhones = useMemo(() => {
    const phones: string[] = [];

    if (user?.phoneUsesWhatsapp) {
      phones.push(user?.phone);
    }
    if (user?.secondaryPhone && user?.secondaryPhoneUsesWhatsapp) {
      phones.push(user.secondaryPhone);
    }

    return phones;
  }, [
    user?.phone,
    user?.phoneUsesWhatsapp,
    user?.secondaryPhone,
    user?.secondaryPhoneUsesWhatsapp,
  ]);

  const openWhatsApp = (phoneNumber: string | undefined) => {
    if (!!phoneNumber) {
      const url = `https://wa.me/55${+phoneNumber.replace(/[\s()-]/g, "")}`;
      window.open(url, "_blank");
    }
  };

  const openPhoneApp = (phoneNumber: string | undefined) => {
    if (!phoneNumber) return;
    const cleanedPhoneNumber = phoneNumber.replace(/[\s()-]/g, "");
    const url = `tel:${cleanedPhoneNumber}`;
    window.open(url, "_blank");
  };

  return (
    <div className={cn("relative w-full rounded-lg p-4", className)}>
      {showBlured && (
        <Link
          href="/login"
          className="font-poppins-600 absolute left-16 top-14 z-10 text-xl underline"
        >
          <span className="text-accent">Entre</span> para ver detalhes
        </Link>
      )}

      <div
        className={cn("flex w-full justify-between space-x-4", {
          "select-none blur": showBlured,
        })}
      >
        <div className="flex flex-col gap-2">
          <span className="mb-1 w-40 break-all text-lg font-bold capitalize">
            {user?.name}
          </span>

          <div className="flex gap-2">
            <MapPinIcon className="size-5 text-current" />
            <span className="text-sm capitalize text-gray-500">
              {user?.city} - {user?.province}
            </span>
          </div>

          {user?.instagram && (
            <div className="flex items-start justify-start gap-2">
              <Image
                priority
                src="/images/icons/instagram-app-icon.svg"
                height={17}
                width={17}
                alt="Instagram"
              />
              <span className="mb-1 break-all text-sm">{user.instagram}</span>
            </div>
          )}

          {whatsAppPhones.length > 0 && (
            <div className="flex items-start justify-start gap-2">
              <Image
                alt=""
                priority
                className={cn("not-sr-only", { "cursor-pointer": isClickable })}
                src="/images/icons/whatsapp-icon.svg"
                height={22}
                width={22}
                onClick={
                  isClickable
                    ? () => {
                      openWhatsApp(whatsAppPhones?.[0]);
                    }
                    : undefined
                }
              />
              <div className="flex flex-col">
                {whatsAppPhones.map((phone, index) => (
                  <div
                    aria-roledescription={isClickable ? "button" : undefined}
                    key={index}
                    className={cn("text-sm", { "cursor-pointer": isClickable })}
                    onClick={
                      isClickable
                        ? () => {
                          openWhatsApp(phone);
                        }
                        : undefined
                    }
                  >
                    {phone}
                  </div>
                ))}
              </div>
            </div>
          )}

          {commonPhones.length > 0 && (
            <div className="mt-[5px] flex items-start justify-start md:pointer-events-none">
              <Image
                priority
                alt=""
                src="/images/icons/phone-icon.svg"
                height={20}
                width={20}
                className={cn("not-sr-only", { "cursor-pointer": isClickable })}
                onClick={
                  isClickable
                    ? () => {
                      openPhoneApp(commonPhones?.[0]);
                    }
                    : undefined
                }
              />
              <div className="flex flex-col md:pointer-events-none">
                {commonPhones.map((phone, index) => (
                  <div
                    aria-roledescription={isClickable ? "button" : undefined}
                    key={index}
                    className={cn("text-sm", { "cursor-pointer": isClickable })}
                    onClick={
                      isClickable
                        ? () => {
                          openPhoneApp(phone);
                        }
                        : undefined
                    }
                  >
                    {phone}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <UserAvatar user={user} showBlured={showBlured} />
      </div>
    </div>
  );
}

function UserAvatar({
  user,
  className,
  showBlured = false,
}: { user: User | PrismaUser; showBlured?: boolean } & ClassNameProps) {
  return (
    <Avatar
      className={cn(
        "flex aspect-[1/1] h-28 w-24 items-center justify-center",
        className,
      )}
    >
      {user?.avatarImage && (
        <div>
          <AvatarImage
            className="rounded-full object-cover "
            src={showBlured ? undefined : user?.avatarImage}
          />
        </div>
      )}
      <AvatarFallback
        style={{
          backgroundColor: `${generateAvatarColor(user?.name ?? "")}`,
        }}
        className="flex h-24 w-24 items-center justify-center rounded-full border border-slate-200 object-cover lg:w-28"
      >
        <span className={`font-poppins-700 text-2xl text-white`}>
          {user?.name?.substring(0, 2).toLocaleUpperCase()}
        </span>
      </AvatarFallback>
    </Avatar>
  );
}
