import { type User } from "lucia";
import { NossaTerraLogo } from "./NossaTerraLogo";
import { type PropsWithChildren } from "react";
import Link from "next/link";
import {
  DollarSignIcon,
  FolderOpenIcon,
  MenuIcon,
  PhoneIcon,
  SearchIcon,
  TagsIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { useRouter } from "next/router";
import { cn } from "~/utils/ui";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";

interface NavItem {
  href: string;
  label: string;
  icon: JSX.Element;
}

function NavItem({ href, label, icon }: NavItem) {
  const { pathname } = useRouter();
  const isSelected = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-row gap-2",
        "font-poppins-600 border-textPrimary px-5 py-4 text-textPrimary",
        "hover:bg-textSecondary hover:bg-opacity-70 hover:text-slate-100 hover:opacity-100 hover:shadow-md",
        isSelected ? "border-b-2" : "opacity-60",
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
          className="flex flex-col gap-4 py-16"
          hideClose
          overlayClassName="bg-black/30"
        >
          {children}
        </SheetContent>
      </Sheet>
    </>
  );
}

export function AppHeader({ user }: { user: User }) {
  return (
    <div className="flex w-full items-center justify-between px-10 pb-7 pt-10">
      <NavBar>
        <NavItem
          href="/search"
          label="Pesquisa de Anúncios"
          icon={<SearchIcon />}
        />
        {user.role === "buyer" && (
          <NavItem
            href="/listings"
            label="Meus Anúncios"
            icon={<FolderOpenIcon />}
          />
        )}
        <NavItem href="/profile" label="Perfil" icon={<UserIcon />} />
        <NavItem href="/contact" label="Fale Conosco" icon={<PhoneIcon />} />
      </NavBar>
      <NossaTerraLogo />
    </div>
  );
}

export function BackofficeHeader({ user }: { user: User }) {
  return (
    <div className="flex w-full items-center justify-between p-10">
      <NavBar>
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
      </NavBar>
      <NossaTerraLogo />
    </div>
  );
}
