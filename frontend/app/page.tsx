'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CompanyForm } from '@/components/CompanyForm';
import { CompanyTable } from '@/components/CompanyTable';
import { SearchBar } from '@/components/SearchBar';
import { ApiError, createCompany, deleteCompany, listCompanies } from '@/lib/api';
import type { Company, CreateCompanyInput } from '@/types/company';

export default function HomePage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [listLoading, setListLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const refreshCompanies = useCallback(async (query: string, signal?: AbortSignal) => {
    if (hasLoadedRef.current) {
      setRefreshing(true);
    } else {
      setListLoading(true);
    }
    setListError(null);

    try {
      const data = await listCompanies(query, signal);
      setCompanies(data);
      hasLoadedRef.current = true;
    } catch (err) {
      if (signal?.aborted) {
        return;
      }
      setListError(err instanceof ApiError ? err.message : 'Failed to load companies.');
    } finally {
      if (!signal?.aborted) {
        setListLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const refreshTimer = window.setTimeout(() => {
      void refreshCompanies(debouncedSearch, controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(refreshTimer);
      controller.abort();
    };
  }, [debouncedSearch, refreshCompanies]);

  async function handleCreate(input: CreateCompanyInput) {
    setCreateLoading(true);
    setActionError(null);
    setSuccess(null);

    try {
      await createCompany(input);
      setSuccess(`Created "${input.companyName}".`);
      await refreshCompanies(debouncedSearch);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to create company.';
      setActionError(message);
      throw err;
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const company = companies.find((item) => item.id === id);
    if (!window.confirm(`Delete "${company?.companyName ?? 'this company'}"?`)) {
      return;
    }

    setDeletingId(id);
    setActionError(null);
    setSuccess(null);

    try {
      await deleteCompany(id);
      setSuccess('Company deleted.');
      await refreshCompanies(debouncedSearch);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Failed to delete company.');
    } finally {
      setDeletingId(null);
    }
  }

  const error = actionError ?? listError;

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Companies
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Create, search, and manage company records.
          </p>
        </header>

        {(error || success) && (
          <div className="mb-6 space-y-2">
            {error && (
              <div
                className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {success}
              </div>
            )}
          </div>
        )}

        <section className="mb-8 rounded-md border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-zinc-900">Add company</h2>
          <CompanyForm onSubmit={handleCreate} loading={createLoading} />
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-baseline gap-3">
              <h2 className="text-lg font-medium text-zinc-900">All companies</h2>
              {refreshing && (
                <span className="text-xs text-zinc-500">Updating…</span>
              )}
            </div>
            <div className="w-full sm:max-w-xs">
              <SearchBar value={search} onChange={setSearch} />
            </div>
          </div>

          <CompanyTable
            companies={companies}
            loading={listLoading && companies.length === 0 && !listError}
            empty={!listLoading && companies.length === 0 && !listError}
            failed={!listLoading && companies.length === 0 && Boolean(listError)}
            deletingId={deletingId}
            onDelete={handleDelete}
          />
        </section>
      </div>
    </main>
  );
}
