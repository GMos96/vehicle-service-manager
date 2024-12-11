import { ContainerRefContext } from "@/core/context/container-ref.context";
import { ReactNode, RefObject } from "react";

type Props = {
  children: ReactNode;
  ref: RefObject<HTMLDivElement>;
};
export const ModalProvider = ({ children, ref }: Props) => {
  return (
    <ContainerRefContext.Provider value={ref}>
      {children}
    </ContainerRefContext.Provider>
  );
};
