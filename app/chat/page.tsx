"use client";
import React, { useState } from "react";
import { useChat } from "ai/react";

const Page = () => {
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");

  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading: chatEndpointIsLoading,
  } = useChat({
    onError: (e) => {
      console.log(e);
    },
  });

  const handleButtonClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (chatEndpointIsLoading) {
      return;
    }
    handleSubmit(e);
  };

  return (
    <div>
      <form onSubmit={handleButtonClick}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter your message"
        />
        <button type="submit">
          {chatEndpointIsLoading ? "Loading..." : "Submit"}
        </button>
      </form>
      <div>
        {messages.map((m) => (
          <p key={m.id}>{m.content}</p>
        ))}
      </div>
    </div>
  );
};

export default Page;
