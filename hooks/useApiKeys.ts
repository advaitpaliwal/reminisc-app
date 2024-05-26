import { ApiKey } from "@/types/apiKey";
import { useState, useEffect } from "react";

const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newKey, setNewKey] = useState<string | null>(null);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch("/api/key");
      const data = await response.json();
      setApiKeys(data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch API keys");
      setLoading(false);
    }
  };

  const createApiKey = async (name: string) => {
    try {
      const response = await fetch("/api/key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      setApiKeys([...apiKeys, data]);
      setNewKey(data.secret_key);
    } catch (error) {
      setError("Failed to create API key");
    }
  };

  const updateApiKey = async (id: string, name: string) => {
    try {
      await fetch(`/api/key`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKeyId: id, name }),
      });
      setApiKeys(apiKeys.map((key) => (key.id === id ? { ...key, name } : key)));
    } catch (error) {
      setError("Failed to update API key");
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      await fetch(`/api/key`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKeyId: id }),
      });
      setApiKeys(apiKeys.filter((key) => key.id !== id));
    } catch (error) {
      setError("Failed to delete API key");
    }
  };

  return { apiKeys, loading, error, newKey, createApiKey, updateApiKey, deleteApiKey };
};

export default useApiKeys;
