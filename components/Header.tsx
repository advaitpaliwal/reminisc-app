import { Edit, Settings, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import ReminiscLogo from "@/components/header/logo";
import { ThemeToggle } from "@/components/header/theme-toggle";
import { UserMenu } from "@/components/header/user-menu";
import { CreateMemoryForm } from "@/components/CreateMemoryForm";
import { useMemories } from "@/hooks/useMemories";
import { Memory } from "@/types/memory";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useMemoryStore } from "@/stores/useMemoryStore";

export const Header = () => {
  const { editingMemoryId, deleteMemory, editMemory, setEditingMemoryId } =
    useMemoryStore();

  const { memories } = useMemories();

  const handleEditMemory = async (
    e: React.FormEvent,
    memoryId: string,
    updatedContent: string
  ) => {
    e.preventDefault();
    await editMemory(memoryId, updatedContent);
  };

  const handleDeleteMemory = async (memoryId: string) => {
    await deleteMemory(memoryId);
  };

  return (
    <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
      <ReminiscLogo />
      <h1 className="text-xl font-medium font-serif">Reminisc</h1>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Settings />
            <span className="sr-only">Memories</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[80vh]">
          <DrawerHeader>
            <DrawerTitle>Memories</DrawerTitle>
            <DrawerDescription>
              Configure and manage your memories.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-6 overflow-auto p-4 pt-0">
            <CreateMemoryForm />
            <fieldset className="grid gap-2 rounded-lg border p-4">
              <legend className="-ml-1 px-1 text-sm font-medium">
                Memories
              </legend>
              {memories.length === 0 && (
                <p className="text-sm p-12">
                  No memories found. Create your first one!
                </p>
              )}
              <Separator className="my-1" />
              <ScrollArea className="max-h-[60vh] rounded-md p-2">
                {memories.map((memory: Memory) => (
                  <div key={memory.id} className="grid gap-2 p-2">
                    {editingMemoryId === memory.id ? (
                      <form
                        onSubmit={(e) =>
                          handleEditMemory(
                            e,
                            memory.id,
                            e.currentTarget.content.value
                          )
                        }
                        className="grid gap-2"
                      >
                        <Textarea
                          id="content"
                          defaultValue={memory.content}
                          placeholder="Enter a memory..."
                          className="min-h-[4rem] resize-none "
                        />
                        <Button type="submit">Save</Button>
                      </form>
                    ) : (
                      <p className="text-md">{memory.content}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-sm">{memory.created_at}</p>
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
          </div>
        </DrawerContent>
      </Drawer>
      <div className="flex-1" />
      <UserMenu />
      <ThemeToggle />
      <div />
    </header>
  );
};
