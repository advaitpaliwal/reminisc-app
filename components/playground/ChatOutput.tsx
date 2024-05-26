import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { TypingIndicator } from "@/components/playground/Playground/TypingIndicator";
import { ExampleMessages } from "@/components/playground/Playground/ExampleMessages";
import { useChat } from "ai/react";
import { CornerDownLeft, NotebookPenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useMemories } from "@/hooks/useMemories";

export const ChatOutput = () => {
  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading: chatEndpointIsLoading,
  } = useChat();

  const { processMemory } = useMemories();

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
        toast.success("Memory updated", {
          icon: <NotebookPenIcon />,
          description: data.content,
          className: "flex flex-row gap-4",
        });
      }
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
        <div className="flex-1">
          {messages.map((m, index) => (
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
          {chatEndpointIsLoading && <TypingIndicator />}
        </div>
      </ScrollArea>
      <div className="flex-1" />
      {messages.length === 0 && (
        <ExampleMessages
          onMessageClick={(description) => setInput(description)}
        />
      )}
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
          className="min-h-12 resize-none border-0 p-4 shadow-none focus-visible:ring-0 flex-grow"
          value={input}
          onChange={handleInputChange}
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
