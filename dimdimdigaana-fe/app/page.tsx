"use client";
import { useEffect, useState } from "react";
import { getUsers, User } from "@/lib/api";
import UserForm from "@/components/UserForm";
import UserTable from "@/components/UserTable";
import UserSearch from "@/components/UserSearch";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  async function load() {
    setLoadError(null);
    try {
      setUsers(await getUsers());
      setIsSearchActive(false);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load users");
    }
  }

  function handleSearchResults(results: User[]) {
    setUsers(results);
    setIsSearchActive(true);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <UserForm onCreated={load} />
      <UserSearch onResults={handleSearchResults} />
      {loadError && (
        <p className="mb-4 text-sm text-red-400">{loadError}</p>
      )}
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
    </>
  );
}

