import { FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToolStatusStore } from "@/stores/useToolStatusStore";

export const ActionIndicator: FC = () => {
  const currentAction = useToolStatusStore((state) => state.currentAction);

  if (!currentAction) return null;

  return (
    <div className="mb-4 flex justify-start">
      <div className="rounded-lg px-4 py-2 text-lg bg-none">
        <Accordion type="single" collapsible className="w-full mt-2">
          <AccordionItem value={currentAction.type}>
            <AccordionTrigger>{currentAction.title}</AccordionTrigger>
            <AccordionContent>{currentAction.content}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
