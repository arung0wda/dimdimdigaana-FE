"use client";
import { useEffect, useState } from "react";
import { getUsers } from "@/lib/api";
import UserForm from "@/components/UserForm";
import UserTable from "@/components/UserTable";
import { BlockingProvider } from "@/components/BlockingSpinner";

export default function Home() {
  const [users, setUsers] = useState([]);

  async function load() {
    setUsers(await getUsers());
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <BlockingProvider>
      <UserForm onCreated={load} />
      <UserTable users={users} onRefresh={load} />
    </BlockingProvider>
  );
}