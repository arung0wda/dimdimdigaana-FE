"use client";
import { useEffect, useState } from "react";
import { getUsers } from "@/lib/api";
import UserForm from "@/components/UserForm";
import UserTable from "@/components/UserTable";

export default function Home() {
  const [users, setUsers] = useState([]);

  async function load() {
    setUsers(await getUsers());
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <UserForm onCreated={load} />
      <UserTable users={users} onRefresh={load} />
    </>
  );
}