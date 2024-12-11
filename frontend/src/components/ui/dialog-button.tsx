import {
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
import { Button } from "@/components/ui/button";
import { ModalProvider } from "@/providers/modal.provider";

type DialogButtonProps = WithChildren;

const DialogButtonRoot = ({ children }: DialogButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <DialogRoot open={open} onOpenChange={({ open }) => setOpen(open)}>
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

export const DialogButton = {
  Root: DialogButtonRoot,
  Button: DialogButtonTemplate,
  Dialog: Dialog,
};
