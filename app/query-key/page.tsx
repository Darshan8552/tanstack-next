"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

interface User {
  id: number;
  name: string;
}

interface Post {
  id: number;
  userId: number;
  title: string;
}

export default function QueryKeysPage() {
  const [userId, setUserId] = useState(1);

  const userQuery = useQuery({
    queryKey: ["user", userId],
    queryFn: async (): Promise<User> => {
      console.log("👤 Fetching user...");
      const res = await axios.get(
        `https://jsonplaceholder.typicode.com/users/${userId}`
      );
      return res.data;
    },
  });

  const postsQuery = useQuery({
    queryKey: ["posts", userId],
    queryFn: async (): Promise<Post[]> => {
      console.log("📰 Fetching posts...");
      const res = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
      );
      return res.data;
    },
    enabled: !!userQuery.data,
  });

  if (userQuery.isLoading) return <p>Loading user...</p>;
  if (userQuery.isError) return <p>Failed to load user!</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        🔑 Query Keys & Dependent Queries
      </h1>

      <div className="flex gap-3 mb-5">
        <button
          className="px-3 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => setUserId((prev) => (prev === 10 ? 1 : prev + 1))}
        >
          Load Next User ({userId})
        </button>
      </div>

      <div className="border p-4 rounded-lg shadow-sm">
        <h2 className="font-medium mb-2">{userQuery.data?.name}</h2>
        {postsQuery.isFetching && (
          <p className="text-sm text-yellow-600">Loading posts...</p>
        )}

        {postsQuery.data && (
          <ul className="space-y-2">
            {postsQuery.data.slice(0, 3).map((post) => (
              <li key={post.id} className="border-b pb-2">
                {post.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
