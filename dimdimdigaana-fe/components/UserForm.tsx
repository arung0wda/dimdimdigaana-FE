"use client";
import { useState } from "react";
import { createUser, UserPayload } from "@/lib/api";
import { useBlockingCall } from "@/components/BlockingSpinner";

// ── Field definitions ─────────────────────────────────────────

const FORM_FIELDS: { key: keyof UserPayload; label: string; type: string }[] = [
  { key: "username",  label: "Username",       type: "text" },
  { key: "firstName", label: "First Name",     type: "text" },
  { key: "lastName",  label: "Last Name",      type: "text" },
  { key: "dob",       label: "Date of Birth",  type: "date" },
];

const EMPTY_FORM: UserPayload = { username: "", firstName: "", lastName: "", dob: "" };

// ── Component ─────────────────────────────────────────────────

interface Props {
  onCreated: () => Promise<void>;
}

export default function UserForm({ onCreated }: Props) {
  const [form, setForm] = useState<UserPayload>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const withBlocking = useBlockingCall();

  async function submit() {
    setError(null);
    try {
      await withBlocking(async () => {
        await createUser(form);
        setForm(EMPTY_FORM);
        await onCreated();
      }, "Creating user…");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  return (
    <div className="bg-slate-900 p-6 rounded-xl shadow-lg mb-8">
      <h2 className="text-lg font-semibold mb-4">Create User</h2>
      <div className="grid grid-cols-2 gap-4">
        {FORM_FIELDS.map(({ key, label, type }) => (
          <input
            key={key}
            placeholder={label}
            value={form[key]}
            type={type}
            onChange={e => setForm({ ...form, [key]: e.target.value })}
            className="bg-slate-800 border border-slate-700 rounded px-3 py-2"
          />
        ))}
      </div>
      {error && (
        <p className="mt-3 text-sm text-red-400">{error}</p>
      )}
      <button
        onClick={submit}
        className="mt-4 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded font-medium"
      >
        Create
      </button>
    </div>
  );
}

