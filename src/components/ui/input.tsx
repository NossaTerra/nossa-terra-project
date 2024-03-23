import { EyeIcon, EyeOffIcon } from "lucide-react";
import * as React from "react";

import { cn } from "src/utils/ui";
import { Button } from "./button";
import { useState } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  suffix?: JSX.Element;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ suffix, className, type, ...props }, ref) => {
    return (
      <div className={cn("flex items-center gap-3")}>
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
            // Custom Theme overrides
            "bg-backgroundPrimary",
            className,
          )}
          ref={ref}
          {...props}
        />
        {suffix}
      </div>
    );
  },
);
Input.displayName = "Input";

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = React.useCallback(
      () => setShowPassword((prev) => !prev),
      [],
    );

    return (
      <div className="relative">
        <Input
          {...props}
          type={showPassword ? "text" : "password"}
          className={cn("pr-8", className)}
          placeholder="Password"
          ref={ref}
        />
        <Button
          className="absolute right-1 top-1 h-7 w-7"
          onClick={toggleShowPassword}
          type="button"
          size="icon"
          variant="ghost"
        >
          {showPassword ? (
            <EyeOffIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </Button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export { Input, PasswordInput };
