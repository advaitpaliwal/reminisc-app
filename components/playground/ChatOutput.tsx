"use client";

import { useEffect, useRef, FormEvent, KeyboardEvent } from "react";
import { useChat } from "@/hooks/useChat";
import { toast } from "sonner";
import { useToastStore } from "@/stores/useToastStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { TypingIndicator } from "@/components/playground/TypingIndicator";
import { ExampleMessages } from "@/components/playground/ExampleMessages";
import { CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";

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

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (toastNotification) {
      toast.info(toastNotification.message, {
        description: toastNotification.description,
        action: toastNotification.onUndo
          ? {
              label: "Undo",
              onClick: () => {
                toastNotification.onUndo?.();
                setToastNotification(null);
              },
            }
          : undefined,
      });
      setToastNotification(null);
    }
  }, [toastNotification, setToastNotification]);

  const handleChatSubmit = async (e: FormEvent<HTMLFormElement>) => {
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

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChatSubmit(e as unknown as FormEvent<HTMLFormElement>);
    }
  };

  return (
    <div className="p-4 box-border relative flex flex-col h-[80vh] md:h-[90vh] rounded-xl bg-muted/50 lg:col-span-2">
      <ScrollArea className="flex-1 rounded-md overflow-auto p-2">
        <div className="flex flex-col h-full">
          {messages.length === 0 && (
            <div className="flex-grow flex items-center justify-center">
              <ExampleMessages
                onMessageClick={(description: string) => {
                  setInput(description);
                  inputRef.current?.focus();
                }}
              />
            </div>
          )}
          {messages.map((m, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 text-sm md:text-base max-w-[80%] md:max-w-[70%] ${
                  m.role === "user"
                    ? "bg-[#f4f4f4] dark:text-primary dark:bg-[#2f2f2f]"
                    : "bg-none"
                }`}
              >
                <ReactMarkdown
                  components={{
                    p: ({ node, ...props }) => (
                      <p className="mb-2 break-words" {...props} />
                    ),
                    h1: ({ node, ...props }) => (
                      <h1
                        className="text-xl md:text-2xl font-bold mb-2"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-lg md:text-xl font-bold mb-2"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-base md:text-lg font-bold mb-2"
                        {...props}
                      />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="list-disc list-inside mb-2 pl-4"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="list-decimal list-inside mb-2 pl-4"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="mb-1 break-words" {...props} />
                    ),
                    code: ({ node, ...props }) => (
                      <code
                        className="block bg-gray-200 dark:bg-gray-700 rounded p-2 my-2 overflow-x-auto text-xs md:text-sm"
                        {...props}
                      />
                    ),
                    pre: ({ node, ...props }) => (
                      <pre
                        className="bg-gray-200 dark:bg-gray-700 rounded p-2 my-2 overflow-x-auto text-xs md:text-sm"
                        {...props}
                      />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-4 border-gray-300 pl-4 italic my-2"
                        {...props}
                      />
                    ),
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {chatEndpointIsLoading && <TypingIndicator />}
          <div ref={messageEndRef} />
        </div>
      </ScrollArea>
      <Label htmlFor="Output" className="sr-only">
        Output
      </Label>

      <form
        className="mt-auto relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring flex items-center p-4"
        onSubmit={handleChatSubmit}
      >
        <Label htmlFor="message" className="sr-only">
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Ask Reminisc to remember something"
          className="min-h-12 resize-none border-0 shadow-none focus-visible:ring-0 flex-grow"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          ref={inputRef}
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
