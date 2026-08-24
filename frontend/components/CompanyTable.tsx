'use client';

import { isHttpUrl } from '@/lib/url';
import type { Company } from '@/types/company';

interface CompanyTableProps {
  companies: Company[];
  loading: boolean;
  empty: boolean;
  failed: boolean;
  deletingId: string | null;
  onDelete: (id: string) => void;
}

export function CompanyTable({
  companies,
  loading,
  empty,
  failed,
  deletingId,
  onDelete,
}: CompanyTableProps) {
  if (loading) {
    return (
      <div className="rounded-md border border-zinc-200 bg-white px-4 py-10 text-center text-sm text-zinc-500">
        Loading companies…
      </div>
    );
  }

  if (failed) {
    return (
      <div className="rounded-md border border-red-200 bg-white px-4 py-10 text-center text-sm text-zinc-600">
        Could not load companies. Try again after checking the API connection.
      </div>
    );
  }

  if (empty) {
    return (
      <div className="rounded-md border border-dashed border-zinc-300 bg-white px-4 py-10 text-center text-sm text-zinc-500">
        No companies found. Create one above or adjust your search.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-zinc-200 bg-white">
      <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
        <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
          <tr>
            <th className="px-4 py-3 font-medium">Company</th>
            <th className="px-4 py-3 font-medium">Website</th>
            <th className="px-4 py-3 font-medium">Industry</th>
            <th className="px-4 py-3 font-medium">Employees</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {companies.map((company) => (
            <tr key={company.id} className="text-zinc-800">
              <td className="px-4 py-3 font-medium whitespace-nowrap">
                {company.companyName}
              </td>
              <td className="max-w-[16rem] px-4 py-3">
                {company.website && isHttpUrl(company.website) ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-zinc-700 underline decoration-zinc-300 underline-offset-2 hover:text-zinc-900"
                  >
                    {company.website.replace(/^https?:\/\//, '')}
                  </a>
                ) : company.website ? (
                  <span className="break-all text-zinc-600">{company.website}</span>
                ) : (
                  <span className="text-zinc-400">—</span>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">{company.industry}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                {company.employeeCount.toLocaleString()}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-zinc-600">
                {formatDate(company.createdAt)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <button
                  type="button"
                  disabled={deletingId === company.id}
                  onClick={() => onDelete(company.id)}
                  className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingId === company.id ? 'Deleting…' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}
