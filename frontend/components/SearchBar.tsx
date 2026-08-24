'use client';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="w-full">
      <label htmlFor="company-search" className="mb-1.5 block text-sm font-medium text-zinc-700">
        Search by name
      </label>
      <input
        id="company-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Acme"
        maxLength={200}
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
      />
    </div>
  );
}
