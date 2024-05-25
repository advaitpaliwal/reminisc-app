import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMemoryStore } from "@/stores/useMemoryStore";
import { PencilIcon } from "lucide-react";
import { toast } from "sonner";

export const CreateMemoryForm = () => {
  const { newMemoryContent, setNewMemoryContent, createMemory } =
    useMemoryStore();

  const handleCreateMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemoryContent.trim() !== "") {
      const createdMemory = await createMemory(newMemoryContent);
      if (createdMemory) {
        toast.success("Memory created successfully.", {
          icon: <PencilIcon />,
          description: createdMemory.content,
        });
      } else {
        toast.error("Failed to create memory.");
      }
    }
  };
  return (
    <form
      onSubmit={handleCreateMemory}
      className="grid w-full items-start gap-6"
    >
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Create Memory
        </legend>
        <div className="grid gap-3">
          <Textarea
            id="content"
            value={newMemoryContent}
            onChange={(e) => setNewMemoryContent(e.target.value)}
            placeholder="Enter a memory..."
            className="min-h-[4rem] resize-none"
          />
        </div>
        <Button type="submit">Create</Button>
      </fieldset>
    </form>
  );
};
