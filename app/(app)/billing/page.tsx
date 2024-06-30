import { PricingCardsPage } from "@/components/billing/PricingCards";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function BillingPage() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/signin");
  }
  return <PricingCardsPage />;
}
