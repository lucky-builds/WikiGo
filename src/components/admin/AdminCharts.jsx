// Admin dashboard chart components

import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Color palettes for different themes
const getColors = (theme) => {
  if (theme === 'dark') {
    return {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      grid: '#374151',
      text: '#f3f4f6',
      background: '#1f2937',
    };
  } else if (theme === 'classic') {
    return {
      primary: '#000000',
      secondary: '#4b5563',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      grid: '#d1d5db',
      text: '#000000',
      background: '#ffffff',
    };
  } else {
    return {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      grid: '#e5e7eb',
      text: '#1f2937',
      background: '#ffffff',
    };
  }
};

// Stat Card Component
export function StatCard({ title, value, subtitle, icon: Icon, loading = false }) {
  const { theme } = useTheme();
  const colors = getColors(theme);

  return (
    <Card className={`shadow-sm ${theme === 'dark' ? 'bg-slate-800' : theme === 'classic' ? 'bg-white border-2 border-black' : 'bg-white'}`}>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : theme === 'classic' ? 'text-black' : 'text-slate-600'}`}>
            {title}
          </CardTitle>
          {Icon && (
            <Icon className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : theme === 'classic' ? 'text-black' : 'text-slate-400'}`} />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className={`h-6 w-6 animate-spin ${theme === 'dark' ? 'text-gray-400' : 'text-slate-400'}`} />
          </div>
        ) : (
          <>
            <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'}`}>
              {value}
            </div>
            {subtitle && (
              <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : theme === 'classic' ? 'text-black' : 'text-slate-500'}`}>
                {subtitle}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Line Chart Component
export function AdminLineChart({ data, dataKey, title, xAxisKey = 'date', loading = false, multipleLines = [] }) {
  const { theme } = useTheme();
  const colors = getColors(theme);

  if (loading || !data || data.length === 0) {
    return (
      <Card className={`shadow-sm ${theme === 'dark' ? 'bg-slate-800' : theme === 'classic' ? 'bg-white border-2 border-black' : 'bg-white'}`}>
        <CardHeader className="p-4">
          <CardTitle className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'}`}>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center justify-center py-12">
            {loading ? (
              <Loader2 className={`h-8 w-8 animate-spin ${theme === 'dark' ? 'text-gray-400' : 'text-slate-400'}`} />
            ) : (
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>No data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`shadow-sm ${theme === 'dark' ? 'bg-slate-800' : theme === 'classic' ? 'bg-white border-2 border-black' : 'bg-white'}`}>
      <CardHeader className="p-4">
        <CardTitle className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'}`}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis
              dataKey={xAxisKey}
              stroke={colors.text}
              tick={{ fill: colors.text }}
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke={colors.text}
              tick={{ fill: colors.text }}
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.grid}`,
                borderRadius: '6px',
                color: colors.text,
              }}
            />
            <Legend wrapperStyle={{ color: colors.text }} />
            {multipleLines.length > 0 ? (
              multipleLines.map((line, index) => (
                <Line
                  key={line.dataKey}
                  type="monotone"
                  dataKey={line.dataKey}
                  stroke={line.color || colors.primary}
                  strokeWidth={2}
                  name={line.name}
                  dot={{ r: 4 }}
                />
              ))
            ) : (
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={colors.primary}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Bar Chart Component
export function AdminBarChart({ data, dataKey, title, xAxisKey = 'date', loading = false, multipleBars = [] }) {
  const { theme } = useTheme();
  const colors = getColors(theme);

  if (loading || !data || data.length === 0) {
    return (
      <Card className={`shadow-sm ${theme === 'dark' ? 'bg-slate-800' : theme === 'classic' ? 'bg-white border-2 border-black' : 'bg-white'}`}>
        <CardHeader className="p-4">
          <CardTitle className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'}`}>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center justify-center py-12">
            {loading ? (
              <Loader2 className={`h-8 w-8 animate-spin ${theme === 'dark' ? 'text-gray-400' : 'text-slate-400'}`} />
            ) : (
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>No data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`shadow-sm ${theme === 'dark' ? 'bg-slate-800' : theme === 'classic' ? 'bg-white border-2 border-black' : 'bg-white'}`}>
      <CardHeader className="p-4">
        <CardTitle className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'}`}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis
              dataKey={xAxisKey}
              stroke={colors.text}
              tick={{ fill: colors.text }}
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke={colors.text}
              tick={{ fill: colors.text }}
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.grid}`,
                borderRadius: '6px',
                color: colors.text,
              }}
            />
            <Legend wrapperStyle={{ color: colors.text }} />
            {multipleBars.length > 0 ? (
              multipleBars.map((bar, index) => (
                <Bar
                  key={bar.dataKey}
                  dataKey={bar.dataKey}
                  fill={bar.color || colors.primary}
                  name={bar.name}
                />
              ))
            ) : (
              <Bar dataKey={dataKey} fill={colors.primary} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Pie Chart Component
export function AdminPieChart({ data, dataKey, nameKey, title, loading = false }) {
  const { theme } = useTheme();
  const colors = getColors(theme);
  const chartColors = [
    colors.primary,
    colors.secondary,
    colors.success,
    colors.warning,
    colors.error,
    '#06b6d4',
    '#f97316',
    '#ec4899',
  ];

  if (loading || !data || data.length === 0) {
    return (
      <Card className={`shadow-sm ${theme === 'dark' ? 'bg-slate-800' : theme === 'classic' ? 'bg-white border-2 border-black' : 'bg-white'}`}>
        <CardHeader className="p-4">
          <CardTitle className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'}`}>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center justify-center py-12">
            {loading ? (
              <Loader2 className={`h-8 w-8 animate-spin ${theme === 'dark' ? 'text-gray-400' : 'text-slate-400'}`} />
            ) : (
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>No data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`shadow-sm ${theme === 'dark' ? 'bg-slate-800' : theme === 'classic' ? 'bg-white border-2 border-black' : 'bg-white'}`}>
      <CardHeader className="p-4">
        <CardTitle className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'}`}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.grid}`,
                borderRadius: '6px',
                color: colors.text,
              }}
            />
            <Legend wrapperStyle={{ color: colors.text }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Scatter Chart Component
export function AdminScatterChart({ data, xKey, yKey, title, loading = false }) {
  const { theme } = useTheme();
  const colors = getColors(theme);

  if (loading || !data || data.length === 0) {
    return (
      <Card className={`shadow-sm ${theme === 'dark' ? 'bg-slate-800' : theme === 'classic' ? 'bg-white border-2 border-black' : 'bg-white'}`}>
        <CardHeader className="p-4">
          <CardTitle className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'}`}>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center justify-center py-12">
            {loading ? (
              <Loader2 className={`h-8 w-8 animate-spin ${theme === 'dark' ? 'text-gray-400' : 'text-slate-400'}`} />
            ) : (
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>No data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`shadow-sm ${theme === 'dark' ? 'bg-slate-800' : theme === 'classic' ? 'bg-white border-2 border-black' : 'bg-white'}`}>
      <CardHeader className="p-4">
        <CardTitle className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : theme === 'classic' ? 'text-black' : 'text-slate-900'}`}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis
              type="number"
              dataKey={xKey}
              name={xKey}
              stroke={colors.text}
              tick={{ fill: colors.text }}
              style={{ fontSize: '12px' }}
            />
            <YAxis
              type="number"
              dataKey={yKey}
              name={yKey}
              stroke={colors.text}
              tick={{ fill: colors.text }}
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.grid}`,
                borderRadius: '6px',
                color: colors.text,
              }}
            />
            <Scatter dataKey={yKey} fill={colors.primary} />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

