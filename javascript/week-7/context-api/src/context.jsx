import { createContext } from "react";

// export const CountContext = createContext();
// or if you want default values:
export const CountContext = createContext({
  count: 0,
  setCount: () => {}
});