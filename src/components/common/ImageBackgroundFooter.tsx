import Image from "next/image";
import { cn } from "~/utils/ui";

// NOTE: Possible optimization to reduce image sizes.
// Serve a JPG with a circular gradient mask (which could be from a file or made programatically via "CSS").
export function ImageBackgroundFooter({ src }: { src: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none z-0 -mt-[36vw] md:-mt-[30vw] flex min-h-[70vh] flex-1 flex-col items-end justify-end overflow-hidden",
      )}
    >
      <div className="relative md:-mb-32 flex h-full max-h-[58vh] md:max-h-[62vh] w-full flex-1">
        <Image
          src={src}
          objectFit="contain"
          objectPosition="right 0% bottom 50%"
          alt="Imagem de fundo"
          fill
        />
      </div>
    </div>
  );
}
