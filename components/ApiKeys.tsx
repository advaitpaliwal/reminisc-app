"use client";

import { NavBar } from "@/components/NavBar";
import { Header } from "@/components/Header";
import ApiKeysTable from "@/components/ApiTable";

export function ApiKeys() {
  return (
    <div className="fixed grid h-screen w-full pl-[56px]">
      <NavBar />
      <div className="h-screen flex flex-col">
        <Header title="API Keys" />
        <main className="grid flex-1 items-start gap-8 p-8 sm:px-10 sm:py-6 md:gap-12">
          <ApiKeysTable />
        </main>
      </div>
    </div>
  );
}
