"use client";

import ApiKeysTable from "@/components/api-keys/ApiTable";

export function ApiKeys() {
  return (
    <main className="grid flex-1 items-start gap-8 p-8 sm:px-10 sm:py-6 md:gap-12">
      <ApiKeysTable />
    </main>
  );
}
