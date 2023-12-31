import { Button, type ButtonVariantType } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../ui/dialog";
import { type ClassNameProps } from "~/utils/ui";

interface ClosableDialogProps extends ClassNameProps {
  buttonLabel: string;
  title: string;
  buttonVariant: ButtonVariantType;
  description?: string;
  children?: React.ReactNode;
}

export const ClosableDialogButton: React.FC<ClosableDialogProps> = ({
  buttonLabel,
  title,
  description,
  children,
  buttonVariant,
  className,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={className} variant={buttonVariant}>
          {buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent isFullWidth>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
          <DialogClose />
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default ClosableDialogButton;
