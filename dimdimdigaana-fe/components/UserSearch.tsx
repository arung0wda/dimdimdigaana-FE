"use client";
import { useState } from "react";
import { SearchCriteria, searchUsers } from "@/lib/api";
import { useBlockingCall } from "@/components/BlockingSpinner";

// ── Field definitions ──────────────────────────────────────────

type FieldType = "string" | "number" | "date" | "age";

interface FieldDef {
  label: string;
  value: string;
  type: FieldType;
}

const FIELDS: FieldDef[] = [
  { label: "ID", value: "id", type: "number" },
  { label: "Username", value: "username", type: "string" },
  { label: "First Name", value: "firstName", type: "string" },
  { label: "Last Name", value: "lastName", type: "string" },
  { label: "Date of Birth", value: "dob", type: "date" },
  { label: "Age", value: "age", type: "age" },
];

// ── Operations per field type ─────────────────────────────────

interface OpDef {
  label: string;
  value: string;
  needsSecondValue?: boolean;
}

const STRING_OPS: OpDef[] = [
  { label: "Equals", value: "EQUALS" },
  { label: "Not Equals", value: "NOT_EQUALS" },
  { label: "Contains", value: "CONTAINS" },
  { label: "Starts With", value: "STARTS_WITH" },
  { label: "Ends With", value: "ENDS_WITH" },
];

const NUMERIC_OPS: OpDef[] = [
  { label: "Equals", value: "EQUALS" },
  { label: "Not Equals", value: "NOT_EQUALS" },
  { label: "Greater Than", value: "GREATER_THAN" },
  { label: "Less Than", value: "LESS_THAN" },
  { label: "Greater Than or Equal", value: "GREATER_THAN_OR_EQUAL" },
  { label: "Less Than or Equal", value: "LESS_THAN_OR_EQUAL" },
  { label: "Between", value: "BETWEEN", needsSecondValue: true },
];

const DATE_OPS: OpDef[] = [
  { label: "Equals", value: "EQUALS" },
  { label: "Not Equals", value: "NOT_EQUALS" },
  { label: "After", value: "GREATER_THAN" },
  { label: "Before", value: "LESS_THAN" },
  { label: "On or After", value: "GREATER_THAN_OR_EQUAL" },
  { label: "On or Before", value: "LESS_THAN_OR_EQUAL" },
  { label: "Between", value: "BETWEEN", needsSecondValue: true },
];

const AGE_OPS: OpDef[] = [
  { label: "Equals", value: "EQUALS" },
  { label: "Not Equals", value: "NOT_EQUALS" },
  { label: "Greater Than", value: "GREATER_THAN" },
  { label: "Less Than", value: "LESS_THAN" },
  { label: "Greater Than or Equal", value: "GREATER_THAN_OR_EQUAL" },
  { label: "Less Than or Equal", value: "LESS_THAN_OR_EQUAL" },
  { label: "Between", value: "BETWEEN", needsSecondValue: true },
];

function getOpsForType(type: FieldType): OpDef[] {
  switch (type) {
    case "string":
      return STRING_OPS;
    case "number":
      return NUMERIC_OPS;
    case "age":
      return AGE_OPS;
    case "date":
      return DATE_OPS;
    default:
      return STRING_OPS;
  }
}

function getInputType(type: FieldType) {
  switch (type) {
    case "number":
    case "age":
      return "number";
    case "date":
      return "date";
    default:
      return "text";
  }
}

// ── Filter row state ──────────────────────────────────────────

interface FilterRow {
  id: number;
  field: string;
  operation: string;
  value: string;
  valueTo: string;
}

let nextId = 1;

function emptyRow(): FilterRow {
  return { id: nextId++, field: "username", operation: "CONTAINS", value: "", valueTo: "" };
}

// ── Component ─────────────────────────────────────────────────

export default function UserSearch({ onResults }: { onResults: (users: any[]) => void }) {
  const [filters, setFilters] = useState<FilterRow[]>([emptyRow()]);
  const withBlocking = useBlockingCall();

  const addFilter = () => setFilters((prev) => [...prev, emptyRow()]);

  const removeFilter = (id: number) =>
    setFilters((prev) => {
      const next = prev.filter((f) => f.id !== id);
      return next.length === 0 ? [emptyRow()] : next;
    });

  const updateFilter = (id: number, patch: Partial<FilterRow>) =>
    setFilters((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));

  const handleFieldChange = (row: FilterRow, newField: string) => {
    const fieldDef = FIELDS.find((f) => f.value === newField)!;
    const ops = getOpsForType(fieldDef.type);
    updateFilter(row.id, { field: newField, operation: ops[0].value, value: "", valueTo: "" });
  };

  const clearAll = () => {
    setFilters([emptyRow()]);
    // No search, just clear
  };

  const doSearch = async () => {
    await withBlocking(async () => {
      // Build criteria — only include rows with a value
      const criteria: SearchCriteria[] = filters
        .filter((f) => f.value.trim() !== "")
        .map((f) => ({
          field: f.field,
          operation: f.operation,
          value: f.value,
          ...(f.valueTo ? { valueTo: f.valueTo } : {}),
        }));

      const users = await searchUsers(criteria);
      onResults(users);
    }, "Searching…");
  };

  return (
    <div className="bg-slate-900 p-6 rounded-xl shadow-lg mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">🔍 Search / Filter Users</h2>
        <div className="flex gap-2">
          <button
            onClick={clearAll}
            className="text-sm text-slate-400 hover:text-slate-200 px-3 py-1 rounded border border-slate-700 hover:border-slate-500"
          >
            Clear All
          </button>
          <button
            onClick={addFilter}
            className="text-sm text-indigo-400 hover:text-indigo-300 px-3 py-1 rounded border border-indigo-700 hover:border-indigo-500"
          >
            + Add Filter
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filters.map((row, idx) => {
          const fieldDef = FIELDS.find((f) => f.value === row.field)!;
          const ops = getOpsForType(fieldDef.type);
          const selectedOp = ops.find((o) => o.value === row.operation);
          const inputType = getInputType(fieldDef.type);

          return (
            <div key={row.id} className="flex items-center gap-3 flex-wrap">
              {/* Conjunction label */}
              <span className="text-xs text-slate-500 w-10 text-right">
                {idx === 0 ? "WHERE" : "AND"}
              </span>

              {/* Field selector */}
              <select
                value={row.field}
                onChange={(e) => handleFieldChange(row, e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm min-w-[140px]"
              >
                {FIELDS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>

              {/* Operation selector */}
              <select
                value={row.operation}
                onChange={(e) => updateFilter(row.id, { operation: e.target.value })}
                className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm min-w-[180px]"
              >
                {ops.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              {/* Primary value */}
              <input
                type={inputType}
                placeholder="Value"
                value={row.value}
                onChange={(e) => updateFilter(row.id, { value: e.target.value })}
                className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm flex-1 min-w-[140px]"
              />

              {/* Secondary value (for BETWEEN) */}
              {selectedOp?.needsSecondValue && (
                <>
                  <span className="text-xs text-slate-500">and</span>
                  <input
                    type={inputType}
                    placeholder="Value To"
                    value={row.valueTo}
                    onChange={(e) => updateFilter(row.id, { valueTo: e.target.value })}
                    className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm flex-1 min-w-[140px]"
                  />
                </>
              )}

              {/* Remove button */}
              <button
                onClick={() => removeFilter(row.id)}
                className="text-red-400 hover:text-red-300 text-sm px-2"
                title="Remove filter"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={doSearch}
        className="mt-4 bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded font-medium"
      >
        Search
      </button>
    </div>
  );
}

