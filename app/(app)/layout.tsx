"use client";
import { ReactNode } from "react";
import { NavBar } from "@/components/nav/NavBar";
import { Header } from "@/components/header/Header";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const [title, setTitle] = useState("");

  useEffect(() => {
    switch (pathname) {
      case "/playground":
        setTitle("Playground");
        break;
      case "/api":
        setTitle("API Keys");
        break;
      default:
        setTitle("Dashboard");
    }
  }, [pathname]);

  return (
    <div className="fixed grid h-screen w-full pl-[56px]">
      <NavBar />
      <div className="h-screen flex flex-col">
        <Header title={title} />
        {children}
      </div>
    </div>
  );
};

export default Layout;
