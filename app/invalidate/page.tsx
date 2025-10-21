"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

interface Post {
  id: number;
  title: string;
  body: string;
}

export default function InvalidatePage() {
  const queryClient = useQueryClient();
  const [newTitle, setNewTitle] = useState("");

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async (): Promise<Post[]> => {
        console.log("Fetching posts...");
      const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
      return res.data;
    },
  });

  const addPostMutation = useMutation({
    mutationFn: async (title: string) => {
      const res = await axios.post("https://jsonplaceholder.typicode.com/posts", {
        title,
        body: "Lorem ipsum",
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  if (isLoading) return <p>Loading posts...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">♻️ Invalidate Queries Demo</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New post title"
          className="border rounded px-2 py-1 flex-1"
        />
        <button
          className="px-3 py-2 bg-blue-500 text-white rounded"
          onClick={() => addPostMutation.mutate(newTitle)}
        >
          Add Post
        </button>
      </div>

      <ul className="space-y-2">
        {posts?.slice(0, 5).map((post) => (
          <li key={post.id} className="border p-2 rounded">
            {post.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
