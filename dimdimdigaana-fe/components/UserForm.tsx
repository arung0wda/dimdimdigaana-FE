"use client";
import { useState } from "react";
import { createUser } from "@/lib/api";
import { useBlockingCall } from "@/components/BlockingSpinner";

export default function UserForm({ onCreated }: any) {
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    dob: ""
  });
  const withBlocking = useBlockingCall();

  async function submit() {
    await withBlocking(async () => {
      await createUser(form);
      setForm({ username: "", firstName: "", lastName: "", dob: "" });
      await onCreated();
    }, "Creating user…");
  }

  return (
    <div className="bg-slate-900 p-6 rounded-xl shadow-lg mb-8">
      <h2 className="text-lg font-semibold mb-4">Create User</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.keys(form).map((key) => (
          <input
            key={key}
            placeholder={key}
            value={(form as any)[key]}
            type={key === "dob" ? "date" : "text"}
            onChange={e => setForm({ ...form, [key]: e.target.value })}
            className="bg-slate-800 border border-slate-700 rounded px-3 py-2"
          />
        ))}
      </div>
      <button
        onClick={submit}
        className="mt-4 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded font-medium"
      >
        Create
      </button>
    </div>
  );
}