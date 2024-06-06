import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMemoryStore } from "@/stores/useMemoryStore";
import { PencilIcon } from "lucide-react";
import { toast } from "sonner";
import { useMemories } from "@/hooks/useMemories";

export const CreateMemoryForm = () => {
  const { newMemoryContent, setNewMemoryContent } = useMemoryStore();
  const { createMemory } = useMemories();

  const handleCreateMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemoryContent.trim() !== "") {
      try {
        await createMemory(newMemoryContent);
        toast.success("Memory created successfully.", {
          description: newMemoryContent,
        });
        setNewMemoryContent("");
      } catch (error) {
        console.error("Error creating memory:", error);
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
