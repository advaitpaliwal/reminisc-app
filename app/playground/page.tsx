import { Playground } from "@/components/Playground";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function PlaygroundPage() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/signin");
  }
  return <Playground />;
}
