"use client";

import {
  CornerDownLeft,
  Edit,
  EditIcon,
  NotebookPenIcon,
  PencilIcon,
  Settings,
  Trash,
  TrashIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/header/theme-toggle";
import ReminiscLogo from "@/components/header/logo";
import { UserMenu } from "@/components/header/user-menu";
import { Memory } from "@/types/memory";
import { useMemoryStore } from "@/stores/memoryStore";
import { useChat } from "ai/react";
import { useMemories } from "@/hooks/useMemories";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const {
    newMemoryContent,
    editingMemoryId,
    setNewMemoryContent,
    createMemory,
    processMemory,
    deleteMemory,
    editMemory,
    setEditingMemoryId,
  } = useMemoryStore();

  const { memories, isLoading: memoriesLoading } = useMemories();

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

  const handleEditMemory = async (
    e: React.FormEvent,
    memoryId: string,
    updatedContent: string
  ) => {
    e.preventDefault();
    const updatedMemory = await editMemory(memoryId, updatedContent);
    if (updatedMemory) {
      toast.success("Memory updated successfully.", {
        icon: <EditIcon />,
        description: updatedMemory.content,
      });
    } else {
      toast.error("Failed to update memory.");
    }
  };

  const handleDeleteMemory = async (memoryId: string, content: string) => {
    const success = await deleteMemory(memoryId);
    if (success) {
      toast.success("Memory deleted successfully.", {
        icon: <TrashIcon />,
        description: content,
      });
    } else {
      toast.error("Failed to delete memory.");
    }
  };

  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading: chatEndpointIsLoading,
  } = useChat();

  const handleChatSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (chatEndpointIsLoading) {
      return;
    }
    if (input.trim() === "") {
      return;
    }
    try {
      handleSubmit(e);
      const data = await processMemory(input);
      if (data?.content) {
        toast.success("Memory created", {
          icon: <NotebookPenIcon />,
          description: data.content,
        });
      } else {
        throw new Error("Memory not created");
      }
    } catch (error: any) {
      console.log("Error creating memory: " + error.message);
    }
  };

  return (
    <div className="grid h-screen w-full">
      <div className="h-screen flex flex-col">
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
                        placeholder="Enter your memory..."
                        className="min-h-[4rem] resize-none"
                      />
                    </div>
                    <Button type="submit">Create</Button>
                  </fieldset>
                </form>
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
                  {memories.map((memory) => (
                    <div key={memory.id} className="grid gap-2">
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
                            placeholder="Enter your memory..."
                            className="min-h-[4rem] resize-none"
                          />
                          <Button type="submit">Save</Button>
                        </form>
                      ) : (
                        <p className="text-sm">{memory.content}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {memory.created_at}
                        </p>
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
                            onClick={() =>
                              handleDeleteMemory(memory.id, memory.content)
                            }
                          >
                            <Trash className="size-4" />
                            <span className="sr-only">Delete Memory</span>
                          </Button>
                        </div>
                      </div>
                      <Separator className="my-1" />
                    </div>
                  ))}
                </fieldset>
              </div>
            </DrawerContent>
          </Drawer>
          <div className="flex-1" />
          <UserMenu />
          <ThemeToggle />
          <div />
        </header>
        <main className="grid h-screen flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3 ">
          <div
            className="relative hidden flex-col items-start gap-8 md:flex "
            x-chunk="dashboard-03-chunk-0"
          >
            <div className="flex flex-col gap-6  w-full min-w-600px">
              <form
                onSubmit={handleCreateMemory}
                className="grid w-full items-start gap-6"
              >
                <fieldset className="grid gap-6 rounded-lg border p-4 ">
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Create Memory
                  </legend>
                  <div className="grid gap-3">
                    <Textarea
                      id="content"
                      value={newMemoryContent}
                      onChange={(e) => setNewMemoryContent(e.target.value)}
                      placeholder="Enter your memory..."
                      className="min-h-12 resize-none"
                    />
                  </div>
                  <Button type="submit">Create</Button>
                </fieldset>
              </form>
              <fieldset className="grid gap-2 rounded-lg border">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Memories
                </legend>
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
                          onSubmit={(e) => {
                            e.preventDefault();
                            editMemory(
                              memory.id,
                              e.currentTarget.content.value
                            );
                          }}
                          className="grid gap-2"
                        >
                          <Textarea
                            id="content"
                            defaultValue={memory.content}
                            placeholder="Enter your memory..."
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
                            onClick={() => deleteMemory(memory.id)}
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
          </div>
          <div className="p-4 box-border relative flex h-[100%] min-h-[50vh] flex-col rounded-xl bg-muted/50 lg:col-span-2 ">
            <ScrollArea className="h-[100%] rounded-md p-4">
              <Label htmlFor="Output" className="sr-only">
                Output
              </Label>
              <div className="flex-1">
                {messages.map((m) => (
                  <div key={m.id}>
                    <div
                      key={m.id}
                      className={`mb-4 flex ${
                        m.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          m.role === "user"
                            ? "bg-[#f4f4f4] dark:text-primary dark:bg-[#2f2f2f]"
                            : "bg-none"
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="flex-1" />
            <form
              className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring flex items-center"
              x-chunk="dashboard-03-chunk-1"
              onSubmit={handleChatSubmit}
            >
              <Label htmlFor="message" className="sr-only">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0 flex-grow"
                value={input}
                onChange={handleInputChange}
              />
              <Button
                type="submit"
                size="icon"
                className="m-2"
                disabled={chatEndpointIsLoading}
              >
                <CornerDownLeft className="size-4" />
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
