import { createContext, RefObject } from "react";

export const ContainerRefContext = createContext<
  RefObject<HTMLElement> | undefined
>(undefined);
