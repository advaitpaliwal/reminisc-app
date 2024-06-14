import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CreateMemoryForm } from "../playground/CreateMemoryForm";
import { MemoriesFieldset } from "../playground/MemoriesFieldset";
import { PanelRightOpen } from "lucide-react";
import { SettingsForm } from "../playground/SettingsForm";

export function MemoriesSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <PanelRightOpen />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <div className="flex flex-col gap-6 w-full">
          <SheetTitle>Manage Memories</SheetTitle>
          <SettingsForm />
          <MemoriesFieldset />
        </div>
      </SheetContent>
    </Sheet>
  );
}
