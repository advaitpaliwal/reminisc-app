"use client";

import { CreateMemoryForm } from "@/components/playground/CreateMemoryForm";
import { Header } from "@/components/header/Header";
import { MemoriesFieldset } from "@/components/playground/MemoriesFieldset";
import { ChatOutput } from "@/components/playground/ChatOutput";
import { NavBar } from "@/components/nav/NavBar";

export const Playground = () => {
  return (
    <div className="fixed grid h-screen w-full pl-[56px]">
      <NavBar />
      <div className="h-screen flex flex-col">
        <Header title="Playground" />
        <main className="grid h-screen flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3 ">
          <div
            className="relative hidden flex-col items-start gap-8 md:flex "
            x-chunk="dashboard-03-chunk-0"
          >
            <div className="flex flex-col gap-6  w-full min-w-600px">
              <CreateMemoryForm />
              <MemoriesFieldset />
            </div>
          </div>
          <ChatOutput />
        </main>
      </div>
    </div>
  );
};
