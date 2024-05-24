"use client";

import {
  CornerDownLeft,
  Edit,
  Mic,
  Paperclip,
  Settings,
  Trash,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/header/theme-toggle";
import ReminiscLogo from "@/components/header/logo";
import { UserMenu } from "@/components/header/user-menu";
import { Memory } from "@/types/memory";
import { useMemoryStore } from "@/stores/memoryStore";
import { useChat } from "ai/react";

export default function Dashboard() {
  const {
    memories,
    newMemoryContent,
    editingMemoryId,
    setNewMemoryContent,
    createMemory,
    deleteMemory,
    editMemory,
    setEditingMemoryId,
  } = useMemoryStore();
  const handleCreateMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemoryContent.trim() !== "") {
      const newMemory: Memory = {
        id: Date.now().toString(),
        user_id: "user1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        content: newMemoryContent,
      };
      createMemory(newMemory);
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

  const handleChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (chatEndpointIsLoading) {
      return;
    }
    handleSubmit(e);
  };

  return (
    <div className="grid h-screen w-full">
      <div className="flex flex-col">
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
                        className="min-h-[12rem] resize-none"
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
                  {memories.map((memory) => (
                    <div key={memory.id} className="grid gap-2">
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
                </fieldset>
              </div>
            </DrawerContent>
          </Drawer>
          <div className="flex-1" />
          <UserMenu />
          <ThemeToggle />
          <div />
        </header>
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3 ">
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
          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2 ">
            <ScrollArea className="max-h-[76vh] rounded-md p-1">
              <div className="flex-1">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`mb-4 flex ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        m.role === "user"
                          ? "bg-primary text-secondary"
                          : "bg-none"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="flex-1" />
            <form
              className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
              x-chunk="dashboard-03-chunk-1"
              onSubmit={handleChatSubmit}
            >
              <Label htmlFor="message" className="sr-only">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                value={input}
                onChange={handleInputChange}
              />
              <div className="flex items-center p-3 pt-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Paperclip className="size-4" />
                      <span className="sr-only">Attach file</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Attach File</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Mic className="size-4" />
                      <span className="sr-only">Use Microphone</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Use Microphone</TooltipContent>
                </Tooltip>
                <Button
                  type="submit"
                  size="sm"
                  className="ml-auto gap-1.5"
                  disabled={chatEndpointIsLoading}
                >
                  {chatEndpointIsLoading ? "Loading..." : "Send Message"}
                  <CornerDownLeft className="size-3.5" />
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
