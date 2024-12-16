import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode, useRef, useState } from "react";
import { WithChildren } from "@/types/with-children";
import { Button, ButtonProps } from "@/components/ui/button";
import { ModalProvider } from "@/providers/modal.provider";

type DialogButtonProps = WithChildren & { open?: boolean };

const DialogButtonRoot = ({ children, open }: DialogButtonProps) => {
  const [_open, setOpen] = useState(open);

  return (
    <DialogRoot open={_open} onOpenChange={({ open }) => setOpen(open)}>
      {children}
    </DialogRoot>
  );
};

const DialogButtonTemplate = ({ children }: WithChildren) => {
  return (
    <DialogTrigger asChild>
      <Button>{children}</Button>
    </DialogTrigger>
  );
};

type DialogProps = {
  title: string | ReactNode;
} & WithChildren;

const Dialog = ({ children, title }: DialogProps) => {
  const portalRef = useRef<HTMLDivElement>(null);

  return (
    <DialogContent ref={portalRef}>
      <ModalProvider ref={portalRef}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>{children}</DialogBody>
        <DialogCloseTrigger />
      </ModalProvider>
    </DialogContent>
  );
};

const DialogActionButton = ({ children, ...rest }: ButtonProps) => {
  return (
    <DialogActionTrigger asChild>
      <Button {...rest}>{children}</Button>
    </DialogActionTrigger>
  );
};

export const DialogButton = {
  Root: DialogButtonRoot,
  Button: DialogButtonTemplate,
  Dialog: Dialog,
  ActionButton: DialogActionButton,
};
