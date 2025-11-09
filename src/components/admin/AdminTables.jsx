// Admin dashboard table components

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowUpDown, Loader2 } from 'lucide-react';

// Sortable table header component
function SortableHeader({ children, sortKey, currentSort, onSort, className = '' }) {
  const { theme } = useTheme();
  const isActive = currentSort.key === sortKey;
  const isAsc = currentSort.direction === 'asc';

  return (
    <th
      className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:opacity-80 ${className} ${
        theme === 'dark'
          ? 'bg-slate-700 text-gray-300'
          : 'bg-slate-100 text-slate-700'
      }`}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-2">
        {children}
        <ArrowUpDown className={`h-4 w-4 ${isActive ? 'opacity-100' : 'opacity-50'}`} />
        {isActive && (
          <span className="text-xs">{isAsc ? '↑' : '↓'}</span>
        )}
      </div>
    </th>
  );
}

// Generic table component
function AdminTable({ title, columns, data, loading, emptyMessage = 'No data available' }) {
  const { theme } = useTheme();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (!sortConfig.key) return data;

    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'string') {
        return aVal.localeCompare(bVal);
      }
      return aVal - bVal;
    });

    return sortConfig.direction === 'asc' ? sorted : sorted.reverse();
  }, [data, sortConfig]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <Card className={`shadow-sm ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
        <CardHeader className="p-4">
          <CardTitle className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className={`h-8 w-8 animate-spin ${theme === 'dark' ? 'text-gray-400' : 'text-slate-400'}`} />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className={`shadow-sm ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
        <CardHeader className="p-4">
          <CardTitle className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className={`text-center py-8 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
            {emptyMessage}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`shadow-sm ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
      <CardHeader className="p-4">
        <CardTitle className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          {title} ({data.length} total)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr>
                {columns.map((col) => (
                  <SortableHeader
                    key={col.key}
                    sortKey={col.key}
                    currentSort={sortConfig}
                    onSort={handleSort}
                  >
                    {col.label}
                  </SortableHeader>
                ))}
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                theme === 'dark' ? 'divide-slate-700 bg-slate-800' : 'divide-slate-200 bg-white'
              }`}
            >
              {paginatedData.map((row, index) => (
                <tr
                  key={index}
                  className={`hover:opacity-80 ${
                    theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-50'
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-slate-900'
                      }`}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className={`mt-4 flex items-center justify-between ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : theme === 'dark'
                  ? 'bg-slate-700 hover:bg-slate-600'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              Previous
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? 'opacity-50 cursor-not-allowed'
                  : theme === 'dark'
                  ? 'bg-slate-700 hover:bg-slate-600'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Daily Challenges Table
export function DailyChallengesTable({ data, loading }) {
  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'start_title', label: 'Start Article' },
    { key: 'goal_title', label: 'Goal Article' },
    {
      key: 'completionCount',
      label: 'Completions',
      render: (value) => value || 0,
    },
    {
      key: 'avgScore',
      label: 'Avg Score',
      render: (value) => value || '-',
    },
    {
      key: 'avgMoves',
      label: 'Avg Moves',
      render: (value) => value || '-',
    },
    {
      key: 'bestScore',
      label: 'Best Score',
      render: (value) => value || '-',
    },
  ];

  return <AdminTable title="Daily Challenges (Last 3 days, Today, Next 7 days)" columns={columns} data={data} loading={loading} />;
}

// Top Users Table
export function TopUsersTable({ data, loading }) {
  const columns = [
    { key: 'username', label: 'Username' },
    {
      key: 'gamesStarted',
      label: 'Games Started',
    },
    {
      key: 'gamesCompleted',
      label: 'Games Completed',
    },
    {
      key: 'completionRate',
      label: 'Completion Rate',
      render: (value) => `${value}%`,
    },
    {
      key: 'avgScore',
      label: 'Avg Score',
      render: (value) => value || '-',
    },
    {
      key: 'avgMoves',
      label: 'Avg Moves',
      render: (value) => value || '-',
    },
  ];

  return <AdminTable title="Top Users" columns={columns} data={data} loading={loading} />;
}

// Leaderboard Table (Extended)
export function LeaderboardTable({ data, loading }) {
  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'username', label: 'Username' },
    { key: 'score', label: 'Score' },
    { key: 'moves', label: 'Moves' },
    {
      key: 'time_ms',
      label: 'Time (s)',
      render: (value) => value || '-',
    },
    { key: 'start_title', label: 'Start' },
    { key: 'goal_title', label: 'Goal' },
  ];

  return <AdminTable title="Leaderboard Entries" columns={columns} data={data} loading={loading} />;
}

// Popular Articles Table
export function PopularArticlesTable({ data, loading, type = 'start' }) {
  const columns = [
    { key: 'title', label: 'Article Title' },
    {
      key: 'count',
      label: 'Usage Count',
    },
  ];

  const formattedData = (data || []).map((item) => ({
    title: item.title,
    count: item.count,
  }));

  return (
    <AdminTable
      title={`Most Popular ${type === 'start' ? 'Start' : 'Goal'} Articles`}
      columns={columns}
      data={formattedData}
      loading={loading}
    />
  );
}

// Category Stats Table
export function CategoryStatsTable({ data, loading }) {
  const columns = [
    { key: 'category', label: 'Category' },
    {
      key: 'count',
      label: 'Usage Count',
    },
  ];

  const formattedData = Object.entries(data || {}).map(([category, count]) => ({
    category,
    count,
  }));

  return <AdminTable title="Category Statistics" columns={columns} data={formattedData} loading={loading} />;
}

