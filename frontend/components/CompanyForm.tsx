'use client';

import { FormEvent, useState } from 'react';
import { isHttpUrl } from '@/lib/url';
import type { CreateCompanyInput } from '@/types/company';

interface CompanyFormProps {
  onSubmit: (input: CreateCompanyInput) => Promise<void>;
  loading: boolean;
}

const emptyForm = {
  companyName: '',
  website: '',
  industry: '',
  employeeCount: '',
};

export function CompanyForm({ onSubmit, loading }: CompanyFormProps) {
  const [form, setForm] = useState(emptyForm);
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLocalError(null);

    const companyName = form.companyName.trim();
    const industry = form.industry.trim();
    const website = form.website.trim();
    const employeeCount = Number(form.employeeCount);

    if (!companyName || !industry) {
      setLocalError('Company name and industry are required.');
      return;
    }

    if (!Number.isInteger(employeeCount) || employeeCount < 1 || employeeCount > 2_147_483_647) {
      setLocalError('Employee count must be a whole number between 1 and 2,147,483,647.');
      return;
    }

    if (website && !isHttpUrl(website)) {
      setLocalError('Website must be a valid URL starting with http:// or https://.');
      return;
    }

    const input: CreateCompanyInput = {
      companyName,
      industry,
      employeeCount,
    };

    if (website) {
      input.website = website;
    }

    try {
      await onSubmit(input);
      setForm(emptyForm);
    } catch {
      return;
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="companyName"
          label="Company name"
          required
          value={form.companyName}
          onChange={(value) => setForm((prev) => ({ ...prev, companyName: value }))}
          maxLength={200}
          disabled={loading}
        />
        <Field
          id="website"
          label="Website"
          placeholder="https://example.com"
          value={form.website}
          onChange={(value) => setForm((prev) => ({ ...prev, website: value }))}
          maxLength={2048}
          disabled={loading}
        />
        <Field
          id="industry"
          label="Industry"
          required
          value={form.industry}
          onChange={(value) => setForm((prev) => ({ ...prev, industry: value }))}
          maxLength={200}
          disabled={loading}
        />
        <Field
          id="employeeCount"
          label="Employee count"
          type="number"
          required
          min={1}
          value={form.employeeCount}
          onChange={(value) => setForm((prev) => ({ ...prev, employeeCount: value }))}
          max={2147483647}
          disabled={loading}
        />
      </div>

      {localError && (
        <p className="text-sm text-red-600" role="alert">
          {localError}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Creating…' : 'Create company'}
      </button>
    </form>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  type?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  maxLength?: number;
}

function Field({
  id,
  label,
  value,
  onChange,
  disabled,
  required,
  type = 'text',
  placeholder,
  min,
  max,
  maxLength,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-zinc-700">
        {label}
        {required ? ' *' : ''}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        min={min}
        max={max}
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:opacity-60"
      />
    </div>
  );
}
