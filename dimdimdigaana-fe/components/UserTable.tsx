"use client";
import { deleteUser } from "@/lib/api";
import { useBlockingCall } from "@/components/BlockingSpinner";

export default function UserTable({ users, onRefresh }: any) {
  const withBlocking = useBlockingCall();

  return (
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
        {users.map((u: any) => (
          <tr key={u.id} className="border-t border-slate-800 hover:bg-slate-900">
            <td className="p-3">{u.username}</td>
            <td className="p-3">{u.firstName} {u.lastName}</td>
            <td className="p-3">{u.dob}</td>
            <td className="p-3">
              <button
                onClick={() =>
                  withBlocking(async () => {
                    await deleteUser(u.id);
                    await onRefresh();
                  }, "Deleting user…")
                }
                className="text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}