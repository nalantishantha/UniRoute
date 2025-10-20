import React, { useEffect, useState } from 'react';
import { Loader2, RefreshCcw, Search } from 'lucide-react';
import AdminLayout from '../../../components/common/Admin/AdminLayout';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const DEFAULT_PAGE_SIZE = 10;

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1, total_items: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');

  const fetchInternships = async (pageNumber, query) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: pageNumber.toString(),
        per_page: DEFAULT_PAGE_SIZE.toString(),
      });
      if (query) params.append('search', query);

      const response = await fetch(`${API_BASE_URL}/api/administration/content/internships/?${params.toString()}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to load internships.');
      }

      setInternships(data.internships || []);
      setSummary(data.summary || null);
      setPagination(data.pagination || { current_page: pageNumber, total_pages: 1, total_items: data.internships?.length || 0 });
    } catch (err) {
      setError(err.message || 'Failed to load internships.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships(page, submittedSearch);
  }, [page, submittedSearch]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setSubmittedSearch(searchTerm.trim());
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSubmittedSearch('');
    setPage(1);
  };

  const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
  const formatDate = (value) => {
    if (!value) return '—';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(value));
  };

  return (
    <AdminLayout pageTitle="Internship Opportunities" pageDescription="Review internship pipeline and engagement levels.">
      <div className="space-y-6">
        <div className="rounded-xl border border-[#E7F3FB] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <form onSubmit={handleSearch} className="flex w-full flex-col gap-3 md:flex-row md:items-center">
              <div className="flex flex-1 items-center rounded-lg border border-[#C1DBF4] bg-white px-3 py-2">
                <Search className="mr-2 h-4 w-4 text-[#7F8B99]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by company or role"
                  className="flex-1 text-sm text-[#123460] placeholder-[#7F8B99] focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-[#1D5D9B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#174A7C]"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex items-center gap-2 rounded-lg border border-[#E7F3FB] px-4 py-2 text-sm text-[#123460] transition-colors hover:bg-[#F5F9FD]"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Reset
                </button>
              </div>
            </form>

            {summary && (
              <div className="grid w-full gap-3 rounded-lg border border-[#E7F3FB] bg-[#F5F9FD] px-4 py-3 text-sm text-[#123460] md:w-auto md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase text-[#7F8B99]">Total</p>
                  <p className="font-semibold">{numberFormatter.format(summary.total || 0)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-[#7F8B99]">Open Roles</p>
                  <p className="font-semibold">{numberFormatter.format(summary.currently_open || 0)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-[#E7F3FB] bg-white shadow-sm">
          {loading ? (
            <div className="flex h-60 items-center justify-center gap-3 text-[#7F8B99]">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading internships...</span>
            </div>
          ) : error ? (
            <div className="space-y-3 p-6 text-center">
              <p className="text-sm text-[#E57373]">{error}</p>
              <button
                onClick={() => fetchInternships(page, submittedSearch)}
                className="rounded-lg bg-[#1D5D9B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#174A7C]"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#E7F3FB] text-left text-sm">
                  <thead className="bg-[#F5F9FD] text-[#61748F]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Title</th>
                      <th className="px-4 py-3 font-semibold">Company</th>
                      <th className="px-4 py-3 font-semibold">Location</th>
                      <th className="px-4 py-3 font-semibold">Stipend</th>
                      <th className="px-4 py-3 font-semibold">Application Deadline</th>
                      <th className="px-4 py-3 font-semibold">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F4F9] text-[#263238]">
                    {internships.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-sm text-[#7F8B99]">
                          No internships found for the current filters.
                        </td>
                      </tr>
                    ) : (
                      internships.map((internship) => (
                        <tr key={internship.id} className="hover:bg-[#F5F9FD]">
                          <td className="px-4 py-3 font-medium">{internship.title || '—'}</td>
                          <td className="px-4 py-3">{internship.company || '—'}</td>
                          <td className="px-4 py-3">{internship.location || '—'}</td>
                          <td className="px-4 py-3">{internship.stipend || '—'}</td>
                          <td className="px-4 py-3">{formatDate(internship.application_deadline)}</td>
                          <td className="px-4 py-3">{formatDate(internship.created_at)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-[#E7F3FB] px-4 py-3 text-sm text-[#61748F]">
                <div>
                  Showing page {pagination.current_page} of {pagination.total_pages} • Total items {pagination.total_items}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={!pagination.has_previous}
                    className="rounded-lg border border-[#E7F3FB] px-3 py-1 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#F5F9FD]"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={!pagination.has_next}
                    className="rounded-lg border border-[#E7F3FB] px-3 py-1 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#F5F9FD]"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Internships;
