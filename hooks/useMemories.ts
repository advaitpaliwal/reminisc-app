import { useEffect, useState } from 'react';
import { useMemoryStore } from "@/stores/useMemoryStore";

export const useMemories = () => {
  const { memories, fetchMemories } = useMemoryStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchMemories();
      setIsLoading(false);
    };

    fetchData();
  }, [fetchMemories]);

  return { memories, isLoading };
};