import React, { useEffect, useMemo, useState } from 'react';
import { Download, FileText, Loader2, RefreshCw, TrendingUp, Users } from 'lucide-react';
import AdminLayout from '../../../components/common/Admin/AdminLayout';
import { getCurrentUser } from '../../../utils/auth';

const buildQuery = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value || value === 0) {
      query.append(key, value);
    }
  });
  return query.toString();
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
  }).format(value || 0);
};

const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value || 0);

const AdminReportGenerator = () => {
  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const thirtyDaysAgoIso = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().slice(0, 10);
  }, []);

  const [startDate, setStartDate] = useState(thirtyDaysAgoIso);
  const [endDate, setEndDate] = useState(todayIso);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  const fetchSummary = async (range) => {
    setLoading(true);
    setError(null);
    try {
      const query = buildQuery({ start_date: range.start, end_date: range.end });
      const response = await fetch(`/api/admin-reports/overview/?${query}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to load report summary');
      }

      setSummary(data.data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/admin-reports/history/?limit=8');
      const data = await response.json();
      if (response.ok && data.success) {
        setHistory(data.reports || []);
      }
    } catch (err) {
      console.error('Failed to load report history', err);
    }
  };

  useEffect(() => {
    fetchSummary({ start: startDate, end: endDate });
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApply = () => {
    if (!startDate || !endDate) {
      setError('Please select a valid date range.');
      return;
    }
    fetchSummary({ start: startDate, end: endDate });
  };

  const handleExport = async () => {
    setExporting(true);
    setError(null);
    const currentUser = getCurrentUser();

    try {
      const response = await fetch('/api/admin-reports/export/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
          requested_by: currentUser?.user_id,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to export PDF report');
      }

      if (data.report?.data_snapshot) {
        setSummary(data.report.data_snapshot);
      }

      await fetchHistory();
      const downloadUrl = data.report?.download_url;
      if (downloadUrl) {
        window.open(downloadUrl, '_blank', 'noopener');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setExporting(false);
    }
  };

  const metadata = summary?.metadata;
  const userStats = summary?.user_management;
  const contentStats = summary?.content;
  const earningsStats = summary?.tutoring_earnings;

  return (
    <AdminLayout
      pageTitle="Admin Performance Reports"
      pageDescription="Generate platform-wide insights and download presentation-ready summaries."
    >
      <div className="space-y-6">
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                max={endDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                min={startDate}
                max={todayIso}
                onChange={(event) => setEndDate(event.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleApply}
                className="inline-flex items-center px-4 py-2.5 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Update View
              </button>
              <button
                type="button"
                onClick={handleExport}
                disabled={exporting}
                className="inline-flex items-center px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
              >
                {exporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                {exporting ? 'Preparing PDF…' : 'Export PDF'}
              </button>
            </div>
          </div>
          {metadata && (
            <p className="mt-4 text-sm text-gray-500">
              Showing insights for <span className="font-semibold text-gray-700">{metadata.start.slice(0, 10)}</span> to{' '}
              <span className="font-semibold text-gray-700">{metadata.end.slice(0, 10)}</span>
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24 bg-white rounded-xl border border-gray-200">
            <Loader2 className="h-6 w-6 text-primary-500 animate-spin mr-3" />
            <span className="text-gray-600">Loading report insights…</span>
          </div>
        ) : (
          summary && (
            <>
              <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                <article className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-500">New Users</h3>
                    <span className="p-2 rounded-full bg-blue-100 text-blue-600">
                      <Users className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-3 text-3xl font-bold text-gray-900">
                    {formatNumber(userStats?.total_new_users)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">Total registrations during selected period</p>
                </article>

                <article className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-500">Content Created</h3>
                    <span className="p-2 rounded-full bg-purple-100 text-purple-600">
                      <FileText className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-3 text-3xl font-bold text-gray-900">
                    {formatNumber(
                      (contentStats?.courses_created || 0) +
                      (contentStats?.mentoring_sessions_created || 0) +
                      (contentStats?.tutoring_sessions_created || 0)
                    )}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">New courses and sessions scheduled</p>
                </article>

                <article className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-500">Tutoring Revenue</h3>
                    <span className="p-2 rounded-full bg-emerald-100 text-emerald-600">
                      <TrendingUp className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-3 text-3xl font-bold text-gray-900">
                    {formatCurrency(earningsStats?.total_revenue || 0)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">Total payments recorded for tutoring</p>
                </article>

                <article className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-500">Avg. Ticket Size</h3>
                    <span className="p-2 rounded-full bg-orange-100 text-orange-600">
                      <BarChartIcon />
                    </span>
                  </div>
                  <p className="mt-3 text-3xl font-bold text-gray-900">
                    {formatCurrency(earningsStats?.average_payment || 0)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">Average payment amount per tutoring transaction</p>
                </article>
              </section>

              <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Registrations by Type</h3>
                  <div className="space-y-4">
                    {userStats?.breakdown?.length ? (
                      userStats.breakdown.map((item) => (
                        <div key={item.user_type__type_name} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-800">
                              {item.user_type__type_name.replace('_', ' ').replace('-', ' ') || 'Unknown'}
                            </p>
                            <p className="text-xs text-gray-500">New registrations</p>
                          </div>
                          <span className="text-base font-semibold text-primary-600">
                            {formatNumber(item.count)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No registration activity recorded for this range.</p>
                    )}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Tutors</h3>
                  <div className="space-y-4">
                    {earningsStats?.top_tutors?.length ? (
                      earningsStats.top_tutors.map((item) => (
                        <div
                          key={item.tutor_id}
                          className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3"
                        >
                          <div>
                            <p className="font-medium text-gray-800">
                              {item.tutor_username || `Tutor #${item.tutor_id}`}
                            </p>
                            <p className="text-xs text-gray-500">{formatNumber(item.sessions)} sessions</p>
                          </div>
                          <span className="text-sm font-semibold text-emerald-600">
                            {formatCurrency(item.total_earnings)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No tutoring revenue recorded for this range.</p>
                    )}
                  </div>
                </div>
              </section>

              <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Popular Courses</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Course Title
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Enrollments
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {contentStats?.popular_courses?.length ? (
                        contentStats.popular_courses.map((course) => (
                          <tr key={course.course__title}>
                            <td className="px-4 py-3 text-sm text-gray-800">{course.course__title}</td>
                            <td className="px-4 py-3 text-sm font-semibold text-primary-600">
                              {formatNumber(course.enrollments)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="px-4 py-6 text-center text-sm text-gray-500">
                            No course enrollments recorded for the selected period.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )
        )}

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Exports</h3>
              <p className="text-sm text-gray-500">Download any of the previously generated PDF reports.</p>
            </div>
            <button
              type="button"
              onClick={fetchHistory}
              className="inline-flex items-center px-3 py-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh List
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Report
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Generated On
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.length ? (
                  history.map((item) => (
                    <tr key={item.report_id}>
                      <td className="px-4 py-3 text-sm text-gray-800">{item.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {item.start_date} → {item.end_date}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(item.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {(item.file_size / 1024).toFixed(1)} KB
                      </td>
                      <td className="px-4 py-3 text-right">
                        <a
                          href={item.download_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                        >
                          <Download className="h-4 w-4 mr-2" /> Download
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-6 text-center text-sm text-gray-500">
                      No reports generated yet. Export a report to build your history.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

const BarChartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

export default AdminReportGenerator;
