import { useState } from "react";
import { useChatStore } from "@/stores/useChatStore";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

export const SettingsForm = () => {
  const { model, setModel, temperature, setTemperature } = useChatStore();

  return (
    <fieldset className="grid gap-6 rounded-lg border p-4">
      <legend className="-ml-1 px-1 text-sm font-medium">Settings</legend>
      <div className="grid gap-3">
        <Label htmlFor="model">Model</Label>
        <Select value={model} onValueChange={setModel} defaultValue="gpt-4o">
          <SelectTrigger id="model" className="items-start">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-3.5-turbo">
              <div className="flex items-start gap-3 text-muted-foreground">
                <div className="grid gap-0.5">
                  <p>gpt-3.5-turbo</p>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="gpt-4">
              <div className="flex items-start gap-3 text-muted-foreground">
                <div className="grid gap-0.5">
                  <p>gpt-4o</p>
                </div>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-3">
        <div className="flex items-center">
          <Label htmlFor="temperature">Temperature</Label>
          <span className="ml-2 text-sm text-muted-foreground">
            {temperature.toFixed(1)}
          </span>
        </div>
        <Slider
          value={[temperature]}
          min={0}
          max={1}
          step={0.1}
          className={cn("w-full")}
          onValueChange={(value) => setTemperature(value[0])}
        />
      </div>
    </fieldset>
  );
};
