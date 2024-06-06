"use client";

import { useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { toast } from "sonner";
import { useToastStore } from "@/stores/useToastStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { TypingIndicator } from "@/components/playground/TypingIndicator";
import { ExampleMessages } from "@/components/playground/ExampleMessages";
import { CornerDownLeft, NotebookPenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const ChatOutput = () => {
  const {
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading: chatEndpointIsLoading,
    messageEndRef,
  } = useChat();

  const { toastNotification, setToastNotification } = useToastStore();

  useEffect(() => {
    if (toastNotification) {
      toast.info(toastNotification.message, {
        description: toastNotification.description,
      });
      setToastNotification(null);
    }
  }, [toastNotification, setToastNotification]);

  const handleChatSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (chatEndpointIsLoading) {
      return;
    }
    if (input.trim() === "") {
      return;
    }
    try {
      await handleSubmit(e);
    } catch (error: any) {
      console.log("Error creating memory: " + error.message);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChatSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <div className="p-4 box-border relative flex h-[100%] min-h-[50vh] flex-col rounded-xl bg-muted/50 lg:col-span-2">
      <ScrollArea className="h-[100%] rounded-md p-4">
        <Label htmlFor="Output" className="sr-only">
          Output
        </Label>

        <div className="flex-">
          {messages.length === 0 && (
            <ExampleMessages
              onMessageClick={(description) => setInput(description)}
            />
          )}
          {messages.map((m, index) => (
            <div key={index}>
              <div
                key={index}
                className={`mb-4 flex ${
                  m.type === "human" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 ${
                    m.type === "human"
                      ? "bg-[#f4f4f4] dark:text-primary dark:bg-[#2f2f2f]"
                      : "bg-none"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            </div>
          ))}
          {chatEndpointIsLoading && <TypingIndicator />}
        </div>
        <div ref={messageEndRef} />
      </ScrollArea>
      <div className="flex-1" />
      <form
        className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring flex items-center"
        onSubmit={handleChatSubmit}
      >
        <Label htmlFor="message" className="sr-only">
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Type your message here..."
          className="min-h-12 resize-none border-0 p-4 shadow-none focus-visible:ring-0 flex-grow"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
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
  );
};
