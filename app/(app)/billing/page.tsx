"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface PricingTier {
  name: string;
  monthlyPrice: string;
  yearlyPrice: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlight?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    monthlyPrice: "$49/mo",
    yearlyPrice: "$39/mo",
    description: "Perfect for early-stage AI startups and small teams.",
    features: ["Up to 10,000 memories", "1 API key", "Basic analytics"],
    cta: "Get Started",
    href: "https://app.reminisc.ai/signup",
  },
  {
    name: "Growth",
    monthlyPrice: "$199/mo",
    yearlyPrice: "$159/mo",
    description: "Ideal for growing AI companies with expanding user bases.",
    features: [
      "Up to 100,000 memories",
      "Up to 2 API Keys",
      "Advanced analytics",
    ],
    cta: "Get Started",
    href: "https://app.reminisc.ai/signup",
    highlight: true,
  },
  {
    name: "Scale",
    monthlyPrice: "$499/mo",
    yearlyPrice: "$399/mo",
    description: "For AI startups ready to scale their memory capabilities.",
    features: [
      "Unlimited memories",
      "Up to 5 API Keys",
      "AI-powered analytics",
    ],
    cta: "Get Started",
    href: "https://app.reminisc.ai/signup",
  },
  {
    name: "Enterprise",
    monthlyPrice: "Custom",
    yearlyPrice: "Custom",
    description: "Tailored solutions for large-scale AI implementations.",
    features: [
      "Everything in Scale, plus:",
      "Custom memory architecture",
      "Custom AI model",
    ],
    cta: "Contact Us",
    href: "/contact",
  },
];

export function BillingPage() {
  const [isMonthly, setIsMonthly] = useState(true);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);

  const handleUpgrade = (tier: PricingTier) => {
    setSelectedTier(tier);
    setShowUpgradeDialog(true);
  };

  const confirmUpgrade = () => {
    if (selectedTier) {
      toast.success(`Upgraded to ${selectedTier.name} plan successfully.`);
      setShowUpgradeDialog(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Choose your plan</h2>
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${isMonthly ? "font-semibold" : ""}`}>
            Monthly
          </span>
          <Switch
            checked={!isMonthly}
            onCheckedChange={(checked) => setIsMonthly(!checked)}
          />
          <span className={`text-sm ${!isMonthly ? "font-semibold" : ""}`}>
            Yearly
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pricingTiers.map((tier) => (
          <Card
            key={tier.name}
            className={`flex flex-col ${
              tier.highlight ? "border-primary" : ""
            }`}
          >
            <CardHeader>
              <h3 className="text-lg font-semibold">{tier.name}</h3>
              <p className="text-2xl font-bold">
                {isMonthly ? tier.monthlyPrice : tier.yearlyPrice}
              </p>
              <p className="text-sm text-muted-foreground">
                {tier.description}
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button
                className="w-full"
                onClick={() => handleUpgrade(tier)}
                variant={tier.highlight ? "default" : "outline"}
              >
                {tier.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upgrade to {selectedTier?.name}</DialogTitle>
            <DialogDescription>
              You are about to upgrade to the {selectedTier?.name} plan. This
              will be billed {isMonthly ? "monthly" : "yearly"}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="card-number" className="text-right">
                Card Number
              </Label>
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiry-date" className="text-right">
                Expiry Date
              </Label>
              <Input
                id="expiry-date"
                placeholder="MM/YY"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cvv" className="text-right">
                CVV
              </Label>
              <Input id="cvv" placeholder="123" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={confirmUpgrade}>
              Confirm Upgrade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function BillingPageWrapper() {
  return (
    <main className="flex-1 overflow-y-auto p-8 sm:px-10 sm:py-6">
      <BillingPage />
    </main>
  );
}
