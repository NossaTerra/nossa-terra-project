import Link from "next/link";
import { type ClassNameProps, cn } from "~/utils/ui";

export function GoogleOAuthButton({ className }: ClassNameProps) {
  // NOTE: The content for this button is a Tailwind CSS version
  // of the OAuth button from the Google Guidelines
  // which can be found here: https://developers.google.com/identity/branding-guidelines
  //
  // To translate to TailwindCSS, the method was to use ChatGPT and make some manual adjustments
  // by comparing it to the original. For example the ChatGPT version didn't had "shadows on hover" for some reason
  return (
    <Link
      className={cn(
        "inline-flex min-w-min items-center justify-between rounded-md border border-gray-500 bg-white px-3 py-3 font-[Roboto,arial,sans-serif] text-sm text-black transition-all duration-200 ease-in-out hover:bg-gray-100 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:border-gray-200 disabled:bg-white disabled:bg-opacity-40 disabled:text-opacity-50",
        className,
      )}
      href="/api/login/google"
    >
      <div className="flex items-center justify-center">
        <svg
          className="mr-2 block h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 48 48"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          ></path>
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          ></path>
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          ></path>
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          ></path>
          <path fill="none" d="M0 0h48v48H0z"></path>
        </svg>
        <span className="flex-grow overflow-hidden text-center font-medium">
          Continuar com o Google
        </span>
      </div>
    </Link>
  );
}
