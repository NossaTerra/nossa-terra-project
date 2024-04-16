import { type User } from "lucia";
import { NossaTerraLogo } from "./NossaTerraLogo";
import { type PropsWithChildren } from "react";
import { type ClassNameProps, cn } from "~/utils/ui";
import Link from "next/link";
import {
  DollarSignIcon,
  FolderOpenIcon,
  LogOut,
  MenuIcon,
  PhoneIcon,
  SearchIcon,
  TagsIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { useRouter } from "next/router";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useAuth } from "~/hooks/useAuth";
import { PermittedRoles } from "~/server/types/user.type";

interface NavItem {
  href: string;
  label: string;
  icon: JSX.Element;
  isSelectable?: boolean;
  onClick?: () => void;
}

function NavItem({ href, label, icon, onClick, isSelectable = true }: NavItem) {
  const { pathname } = useRouter();
  const isSelected =
    isSelectable &&
    (href === "/" ? pathname === href : pathname.startsWith(href));

  return (
    <Link
      onClick={onClick}
      href={href}
      className={cn(
        "flex w-full flex-row items-center justify-start gap-2 lg:w-auto",
        "rounded-full",
        "font-poppins-600 border-textPrimary px-5 py-4 text-textPrimary",
        "hover:bg-slate-600 hover:bg-opacity-85 hover:text-slate-100 hover:opacity-100 hover:shadow-md",
        isSelected
          ? "rounded-full border-[3px] hover:rounded-full"
          : "opacity-60",
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function NavBar({ children }: PropsWithChildren) {
  return (
    <>
      <div className="hidden gap-6 lg:flex">{children}</div>

      <Sheet>
        <SheetTrigger className="flex lg:hidden" asChild>
          <Button variant="outline" size="icon" className="h-16 w-16">
            <MenuIcon size={30} />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex flex-col items-start gap-4 py-16"
          hideClose
          overlayClassName="bg-black/30"
        >
          {children}
        </SheetContent>
      </Sheet>
    </>
  );
}

export function AppHeader({
  className,
  user,
  hideLogo = false,
}: {
  user: User | null;
  hideLogo?: boolean;
} & ClassNameProps) {
  const { logout } = useAuth();

  const commonLayoutClassName =
    "mb-3 flex w-full items-center justify-between bg-cardHover bg-opacity-25 px-10 py-4 shadow";

  if (!user) {
    return (
      <div
        className={cn(
          commonLayoutClassName,
          "flex-col gap-4 sm:flex-row",
          className,
        )}
      >
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
          <NossaTerraLogo className="h-20 w-fit" />
          <h1 className="font-poppins-700 text-center text-lg text-headingPrimary sm:text-left lg:text-xl">
            Seja bem vindo(a) à{" "}
            <span className="font-poppins-700 block w-full text-2xl text-headingSecondary md:text-3xl lg:text-3xl">
              Nossa Terra
            </span>
          </h1>
        </div>
        <Button variant="primary" size="lg" asChild>
          <Link href="/login">
            <UserIcon /> Entrar
          </Link>
        </Button>
      </div>
    );
  }

  const isBackoffice = PermittedRoles.Backoffice.some((r) => r === user.role);

  return (
    <div className={cn(commonLayoutClassName, className)}>
      <NavBar>
        <NavItem href="/" label="Pesquisa de Anúncios" icon={<SearchIcon />} />
        {user.role === "buyer" && (
          <NavItem
            href="/listings"
            label="Meus Anúncios"
            icon={<FolderOpenIcon />}
          />
        )}
        {!isBackoffice && (
          <>
            <NavItem href="/profile" label="Perfil" icon={<UserIcon />} />
            <NavItem
              href="/contact"
              label="Fale Conosco"
              icon={<PhoneIcon />}
            />
          </>
        )}
        {isBackoffice && (
          <>
            <NavItem
              href="/backoffice/users"
              label="Controle de Usuários"
              icon={<UsersIcon />}
            />
            <NavItem
              href="/backoffice/ads"
              label="Anúncios"
              icon={<DollarSignIcon />}
            />
            {user.role === "admin" && (
              <NavItem
                href="/admin/products"
                label="Produtos"
                icon={<TagsIcon />}
              />
            )}
            <NavItem
              onClick={logout}
              href="/"
              isSelectable={false}
              label="Sair"
              icon={<LogOut />}
            />
          </>
        )}
      </NavBar>

      {!hideLogo && (
        <Link href="/">
          <NossaTerraLogo className="h-20 w-fit" />
        </Link>
      )}
    </div>
  );
}
