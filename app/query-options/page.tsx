"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function QueryOptions() {
  const [userId, setUserId] = useState(1);

  const {data, isLoading, isError, isFetching, refetch} = useQuery({
    queryKey: ["posts"],
    queryFn: async (): Promise<User> => {
      console.log("🔄 Fetching data from API...");
      const res = await axios.get(
        `https://jsonplaceholder.typicode.com/users/${userId}`
      );
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: userId > 0,
    retry: 2
  });

  if (isLoading) return <p>Loading user data...</p>;
  if (isError) return <p>Failed to fetch user data 😢</p>;

  return (
     <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">⚙️ Query Options Demo</h1>

      <div className="mb-4 space-x-2">
        <button
          className="px-3 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => setUserId((prev) => (prev === 10 ? 1 : prev + 1))}
        >
          Load Next User
        </button>
        <button
          className="px-3 py-2 bg-green-500 text-white rounded-md"
          onClick={() => refetch()}
        >
          Manual Refetch
        </button>
      </div>

      {isFetching && <p className="text-sm text-yellow-600">Background refetching...</p>}

      <div className="border rounded-lg p-4 mt-3">
        <h2 className="font-medium">{data?.name}</h2>
        <p className="text-sm text-gray-600">{data?.email}</p>
      </div>
    </div>
  );
}
