import { ReactNode } from "react";
import { BottomNav } from "../components";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      {children}
      <div style={{ marginTop: "128px" }} />
      <BottomNav />
    </>
  );
};
