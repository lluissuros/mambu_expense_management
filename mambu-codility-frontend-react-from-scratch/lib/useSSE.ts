"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SSE_URL = process.env.NEXT_PUBLIC_SSE_URL || "http://localhost:8080/events";

export function useSSE() {
  const router = useRouter();

  useEffect(() => {
    // Optional: Connect to SSE endpoint for live updates
    // This is a minimal stub implementation
    const eventSource = new EventSource(SSE_URL);

    eventSource.onmessage = (event) => {
      console.log("SSE message received:", event.data);
      // Refresh the UI when a message arrives
      router.refresh();
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [router]);
}

