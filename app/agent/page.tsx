"use client";

import { useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { toast } from "sonner";
import { useToastStore } from "@/stores/useToastStore";

export default function AgentChat() {
  const { input, setInput, messages, isLoading, handleSubmit, messageEndRef } =
    useChat();
  const { toastNotification, setToastNotification } = useToastStore();

  useEffect(() => {
    if (toastNotification) {
      let toastMessage = "";
      let toastDescription = "";

      if (toastNotification.tool_name === "remember") {
        toastMessage = "Memory Remembered";
        toastDescription = toastNotification.input_params["memory"];
      } else if (toastNotification.tool_name === "revise") {
        toastMessage = "Memory Revised";
        toastDescription = toastNotification.input_params["new_memory"];
      }
      if (toastMessage && toastDescription) {
        toast.info(toastMessage, {
          description: toastDescription,
        });
      }

      setToastNotification(null);
    }
  }, [toastNotification, setToastNotification]);

  return (
    <div className="p-5 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">Chat with Agent</h1>
      <div className="mb-5 border border-gray-300 p-4 h-96 overflow-y-scroll">
        {messages.map((msg, index) => (
          <div key={index} className="mb-3">
            <strong>{msg.type === "human" ? "User" : "AI"}:</strong>{" "}
            <span>{msg.content}</span>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="p-2 flex-grow border border-gray-300 mr-2"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Send"}
        </button>
      </form>
    </div>
  );
}
