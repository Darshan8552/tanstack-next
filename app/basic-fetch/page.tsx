"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Post {
  userId: string;
  id: string;
  title: string;
  body: string;
}

export default function BasicFetchPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: async (): Promise<Post[]> => {
      const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
      return res.data;
    },
  });

  if (isLoading) return <p>Loading posts...</p>;
  if (isError) return <p>Something went wrong!</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">📰 Posts List</h1>
      <ul className="space-y-2">
        {data?.map((post) => (
          <li key={post.id} className="border p-3 rounded-lg shadow-sm">
            <h2 className="font-medium">{post.title}</h2>
            <p className="text-sm text-gray-600">{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
