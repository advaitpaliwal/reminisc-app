// MemoriesFieldset.tsx
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash } from "lucide-react";
import { useMemories } from "@/hooks/useMemories";
import { useMemoryStore } from "@/stores/useMemoryStore";

export const MemoriesFieldset: React.FC = () => {
  const { memories, isLoading, error, editMemory, deleteMemory } =
    useMemories();
  const editingMemoryId = useMemoryStore((state) => state.editingMemoryId);
  const setEditingMemoryId = useMemoryStore(
    (state) => state.setEditingMemoryId
  );

  const handleEditMemory = async (
    e: React.FormEvent,
    memoryId: string,
    updatedContent: string
  ) => {
    e.preventDefault();
    await editMemory(memoryId, updatedContent);
    setEditingMemoryId(null);
  };

  const handleDeleteMemory = async (memoryId: string) => {
    await deleteMemory(memoryId);
  };

  return (
    <fieldset className="grid gap-2 rounded-lg border">
      <legend className="-ml-1 px-1 text-sm font-medium">Memories</legend>
      <ScrollArea className="max-h-[60vh] rounded-md p-2">
        {memories.length === 0 && (
          <p className="text-sm p-12">
            No memories found. Create your first one!
          </p>
        )}
        {memories.map((memory) => (
          <div key={memory.id} className="grid gap-2 p-2">
            {editingMemoryId === memory.id ? (
              <form
                onSubmit={(e) =>
                  handleEditMemory(e, memory.id, e.currentTarget.content.value)
                }
                className="grid gap-2"
              >
                <Textarea
                  id="content"
                  defaultValue={memory.content}
                  placeholder="Enter a memory..."
                  className="min-h-[4rem] resize-none"
                />
                <Button type="submit">Save</Button>
              </form>
            ) : (
              <p className="text-md">{memory.content}</p>
            )}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-300">{memory.updated_at}</p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingMemoryId(memory.id)}
                >
                  <Edit className="size-4" />
                  <span className="sr-only">Edit Memory</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteMemory(memory.id)}
                >
                  <Trash className="size-4" />
                  <span className="sr-only">Delete Memory</span>
                </Button>
              </div>
            </div>
            <Separator className="my-1" />
          </div>
        ))}
      </ScrollArea>
    </fieldset>
  );
};
