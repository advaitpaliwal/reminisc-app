"use client";

import {
  Bird,
  Book,
  Bot,
  Code2,
  CornerDownLeft,
  Edit,
  LifeBuoy,
  Mic,
  Paperclip,
  Rabbit,
  Settings,
  Settings2,
  Share,
  SquareTerminal,
  SquareUser,
  Trash,
  Triangle,
  Turtle,
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
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { LoginButton } from "@/components/auth/login-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/header/theme-toggle";
import ReminiscLogo from "@/components/header/logo";
import { UserMenu } from "@/components/header/user-menu";
import Link from "next/link";

interface Memory {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  content: string;
}

const initialMemories: Memory[] = [
  {
    id: "1",
    user_id: "user1",
    created_at: "2023-05-21T10:00:00Z",
    updated_at: "2023-05-21T10:00:00Z",
    content: "Today I visited the beach and had a great time with my family.",
  },
  {
    id: "2",
    user_id: "user1",
    created_at: "2023-05-20T15:30:00Z",
    updated_at: "2023-05-20T15:30:00Z",
    content:
      "I attended a conference and learned about new technologies in my field.",
  },
  {
    id: "3",
    user_id: "user1",
    created_at: "2023-05-19T09:15:00Z",
    updated_at: "2023-05-19T09:15:00Z",
    content: "I tried a new restaurant in town and the food was amazing!",
  },
  {
    id: "4",
    user_id: "user1",
    created_at: "2023-05-18T18:45:00Z",
    updated_at: "2023-05-18T18:45:00Z",
    content:
      "I went for a hike in the mountains and enjoyed the stunning views.",
  },
  {
    id: "5",
    user_id: "user1",
    created_at: "2023-05-17T14:20:00Z",
    updated_at: "2023-05-17T14:20:00Z",
    content: "I had a great time catching up with an old friend over coffee.",
  },
  {
    id: "6",
    user_id: "user1",
    created_at: "2023-05-16T11:10:00Z",
    updated_at: "2023-05-16T11:10:00Z",
    content: "I started reading a new book and I can't put it down!",
  },
  {
    id: "7",
    user_id: "user1",
    created_at: "2023-05-15T20:00:00Z",
    updated_at: "2023-05-15T20:00:00Z",
    content:
      "I watched a really interesting documentary about space exploration.",
  },
  {
    id: "8",
    user_id: "user1",
    created_at: "2023-05-14T16:30:00Z",
    updated_at: "2023-05-14T16:30:00Z",
    content:
      "I attended a workshop on photography and learned some new techniques.",
  },
  {
    id: "9",
    user_id: "user1",
    created_at: "2023-05-13T08:45:00Z",
    updated_at: "2023-05-13T08:45:00Z",
    content: "I went to a local farmers market and bought some fresh produce.",
  },
  {
    id: "10",
    user_id: "user1",
    created_at: "2023-05-12T19:15:00Z",
    updated_at: "2023-05-12T19:15:00Z",
    content: "I had a fun night out with friends at a new bar in town.",
  },
];

export default function Dashboard() {
  const [memories, setMemories] = useState<Memory[]>(
    initialMemories.sort((a, b) => (b.created_at > a.created_at ? 1 : -1))
  );
  const [newMemoryContent, setNewMemoryContent] = useState("");
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);

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
      setMemories([newMemory, ...memories]);
      setNewMemoryContent("");
    }
  };

  const handleDeleteMemory = (memoryId: string) => {
    setMemories(memories.filter((memory) => memory.id !== memoryId));
  };

  const handleEditMemory = (memoryId: string, updatedContent: string) => {
    setMemories(
      memories.map((memory) =>
        memory.id === memoryId
          ? {
              ...memory,
              content: updatedContent,
              updated_at: new Date().toISOString(),
            }
          : memory
      )
    );
    setEditingMemoryId(null);
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
                            handleEditMemory(
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
                            handleEditMemory(
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
          </div>
          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
            <Badge variant="outline" className="absolute right-3 top-3">
              Output
            </Badge>
            <div className="flex-1" />
            <form
              className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
              x-chunk="dashboard-03-chunk-1"
            >
              <Label htmlFor="message" className="sr-only">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
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
                <Button type="submit" size="sm" className="ml-auto gap-1.5">
                  Send Message
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
