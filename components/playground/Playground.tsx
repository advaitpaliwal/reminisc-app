"use client";

import { useEffect } from "react";
import { CreateMemoryForm } from "@/components/playground/CreateMemoryForm";
import { MemoriesFieldset } from "@/components/playground/MemoriesFieldset";
import { ChatOutput } from "@/components/playground/ChatOutput";
import { SettingsForm } from "./SettingsForm";
import useFetchBase from "@/hooks/useFetchBase";

export const Playground = () => {
  useFetchBase();

  return (
    <main className="grid h-screen flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
      <ChatOutput />
      <div className="relative hidden flex-col items-start gap-8 md:flex">
        <div className="flex flex-col gap-6 w-full h-[75vh]">
          <SettingsForm />
          <MemoriesFieldset />
        </div>
      </div>
    </main>
  );
};
