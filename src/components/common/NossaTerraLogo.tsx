import Image from "next/image";

export function NossaTerraLogo() {
  return (
    <Image
      src="/images/logo-no-background.png"
      width={100}
      height={114}
      priority
      alt="Nossa terra logo"
    />
  );
}
