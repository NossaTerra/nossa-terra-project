import type { PropsWithChildren } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import type { DialogProps } from "~/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";
import type { DrawerProps } from "~/components/ui/drawer";
import { useIsMobile } from "~/hooks/useResponsive";
import { type ClassNameProps, cn } from "~/utils/ui";

export type ResponsiveModalProps = DrawerProps &
  ClassNameProps &
  PropsWithChildren & {
    title?: React.ReactNode;
    description?: React.ReactNode;
    footer?: React.ReactNode;
    drawerProps?: DrawerProps & ClassNameProps;
    dialogProps?: DialogProps & ClassNameProps;
  };

export function ResponsiveModal({
  title,
  description,
  footer,
  children,
  drawerProps = {},
  dialogProps = {},
  className,
  ...props
}: ResponsiveModalProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer {...props} {...drawerProps}>
        <DrawerContent className={cn(className, drawerProps?.className)}>
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          {children}
          <DrawerFooter className="pt-2">{footer}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog {...props} {...dialogProps}>
      <DialogContent className={cn(className, dialogProps.className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
