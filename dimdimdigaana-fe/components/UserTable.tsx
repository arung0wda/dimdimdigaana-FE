"use client";
import { useState } from "react";
import { deleteUser, User } from "@/lib/api";
import { useBlockingCall } from "@/components/BlockingSpinner";

interface Props {
  users: User[];
  onRefresh: () => Promise<void>;
}

export default function UserTable({ users, onRefresh }: Props) {
  const withBlocking = useBlockingCall();
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(id: number) {
    setError(null);
    try {
      await withBlocking(async () => {
        await deleteUser(id);
        await onRefresh();
      }, "Deleting user…");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <>
      {error && (
        <p className="mb-3 text-sm text-red-400">{error}</p>
      )}
      <table className="w-full border border-slate-800 rounded-xl overflow-hidden">
        <thead className="bg-slate-900">
          <tr>
            <th className="p-3 text-left">Username</th>
            <th className="p-3">Name</th>
            <th className="p-3">DOB</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t border-slate-800 hover:bg-slate-900">
              <td className="p-3">{u.username}</td>
              <td className="p-3">{u.firstName} {u.lastName}</td>
              <td className="p-3">{u.dob}</td>
              <td className="p-3">
                <button
                  onClick={() => handleDelete(u.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

