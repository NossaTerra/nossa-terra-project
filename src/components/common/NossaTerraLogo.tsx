import Image from "next/image";
import type { ClassNameProps } from "~/utils/ui";

export function NossaTerraLogo({ className }: ClassNameProps) {
  return (
    <Image
      src="/images/logo-no-background.png"
      width={100}
      height={114}
      priority
      alt="Nossa terra logo"
      className={className}
    />
  );
}
