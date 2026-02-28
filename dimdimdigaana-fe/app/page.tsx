"use client";
import { useEffect, useState } from "react";
import { getUsers } from "@/lib/api";
import UserForm from "@/components/UserForm";
import UserTable from "@/components/UserTable";
import UserSearch from "@/components/UserSearch";
import { BlockingProvider } from "@/components/BlockingSpinner";

export default function Home() {
  const [users, setUsers] = useState<any[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  async function load() {
    setUsers(await getUsers());
    setIsSearchActive(false);
  }

  function handleSearchResults(results: any[]) {
    setUsers(results);
    setIsSearchActive(true);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <BlockingProvider>
      <UserForm onCreated={load} />
      <UserSearch onResults={handleSearchResults} />
      {isSearchActive && (
        <div className="mb-4 flex items-center gap-3">
          <span className="text-sm text-indigo-400">
            Showing {users.length} search result{users.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={load}
            className="text-sm text-slate-400 hover:text-slate-200 underline"
          >
            Clear search / Show all
          </button>
        </div>
      )}
      <UserTable users={users} onRefresh={load} />
    </BlockingProvider>
  );
}