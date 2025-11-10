// Practice Games Management Component for Admin Dashboard

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/contexts/ThemeContext';
import { checkArticleExists, validateArticles } from '@/lib/wikipediaValidation';
import { insertPracticeGame, insertPracticeGamesBulk } from '@/lib/adminPracticeGames';
import { Loader2, Plus, FileText, CheckCircle2, XCircle, AlertCircle, Download, Upload } from 'lucide-react';

export function PracticeGamesManager({ onSuccess }) {
  const { theme } = useTheme();
  const [mode, setMode] = useState('single'); // 'single' or 'bulk'
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);

  // Single mode state
  const [singleGame, setSingleGame] = useState({
    date: '', // Optional date in YYYY-MM-DD format
    start_title: '',
    goal_title: '',
    solution_history: '', // Comma-separated or JSON array string
  });
  const [singleValidation, setSingleValidation] = useState({
    start: null,
    goal: null,
  });

  // Bulk mode state
  const [bulkText, setBulkText] = useState('');
  const [bulkValidation, setBulkValidation] = useState([]);

  // Parse solution history from string
  const parseSolutionHistory = (input) => {
    if (!input || !input.trim()) return [];
    
    // Try parsing as JSON first
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) {
        return parsed.map(s => s.trim()).filter(Boolean);
      }
    } catch {
      // Not JSON, try comma-separated
    }
    
    // Split by comma and clean up
    return input.split(',').map(s => s.trim()).filter(Boolean);
  };

  // Validate single game articles
  const validateSingle = async () => {
    if (!singleGame.start_title || !singleGame.goal_title) {
      setMessage({ type: 'error', text: 'Please enter both start and goal articles' });
      return;
    }

    // Solution history is optional, so we don't validate it here

    setValidating(true);
    setMessage(null);

    try {
      const [startResult, goalResult] = await Promise.all([
        checkArticleExists(singleGame.start_title),
        checkArticleExists(singleGame.goal_title),
      ]);

      setSingleValidation({
        start: startResult,
        goal: goalResult,
      });

      if (startResult.exists && goalResult.exists) {
        setMessage({ type: 'success', text: 'Both articles are valid!' });
      } else {
        const errors = [];
        if (!startResult.exists) errors.push(`Start: ${startResult.error}`);
        if (!goalResult.exists) errors.push(`Goal: ${goalResult.error}`);
        setMessage({ type: 'error', text: errors.join(', ') });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to validate articles' });
    } finally {
      setValidating(false);
    }
  };

  // Parse CSV content
  const parseCSV = (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    // Check if first line is header
    const hasHeader = lines[0].toLowerCase().includes('start') || lines[0].toLowerCase().includes('goal');
    const dataLines = hasHeader ? lines.slice(1) : lines;

    const games = [];
    for (const line of dataLines) {
      // Parse CSV line (handle quoted values)
      const values = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());

        // Support formats: date,start,goal,solution OR start,goal,solution OR date,start,goal OR start,goal
        // Minimum required: start and goal (2 values)
        if (values.length >= 2) {
          let date = null;
          let startIdx = 0;
          let goalIdx = 1;
          let solutionIdx = 2;

          // Check if first value is a date (YYYY-MM-DD format)
          if (values[0].match(/^\d{4}-\d{2}-\d{2}$/)) {
            date = values[0];
            startIdx = 1;
            goalIdx = 2;
            solutionIdx = 3;
          }

          // Solution history is optional - only use if provided
          const solutionHistory = values.length >= solutionIdx + 1 && values[solutionIdx] 
            ? parseSolutionHistory(values[solutionIdx]) 
            : [];

          games.push({
            date: date || null,
            start_title: values[startIdx].replace(/^"|"$/g, ''),
            goal_title: values[goalIdx].replace(/^"|"$/g, ''),
            solution_history: solutionHistory,
          });
        }
    }

    return games;
  };

  // Parse bulk text input (CSV format or pipe-separated)
  const parseBulkInput = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    const games = [];

    for (const line of lines) {
      // Try CSV format first
      if (line.includes(',') && !line.includes('|')) {
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        // Minimum required: start and goal (2 values)
        if (values.length >= 2) {
          // Check if first value is a date
          let date = null;
          let startIdx = 0;
          let goalIdx = 1;
          let solutionIdx = 2;

          if (values[0].match(/^\d{4}-\d{2}-\d{2}$/)) {
            date = values[0];
            startIdx = 1;
            goalIdx = 2;
            solutionIdx = 3;
          }

          // Solution history is optional
          const solutionHistory = values.length >= solutionIdx + 1 && values[solutionIdx]
            ? parseSolutionHistory(values[solutionIdx])
            : [];

          games.push({
            date: date || null,
            start_title: values[startIdx],
            goal_title: values[goalIdx],
            solution_history: solutionHistory,
          });
        }
      } else {
        // Try pipe-separated format
        const parts = line.split('|').map(p => p.trim());
        // Minimum required: start and goal (2 parts)
        if (parts.length >= 2) {
          // Check if first part is a date
          let date = null;
          let startIdx = 0;
          let goalIdx = 1;
          let solutionIdx = 2;

          if (parts[0].match(/^\d{4}-\d{2}-\d{2}$/)) {
            date = parts[0];
            startIdx = 1;
            goalIdx = 2;
            solutionIdx = 3;
          }

          // Solution history is optional
          const solutionHistory = parts.length >= solutionIdx + 1 && parts[solutionIdx]
            ? parseSolutionHistory(parts[solutionIdx])
            : [];

          games.push({
            date: date || null,
            start_title: parts[startIdx],
            goal_title: parts[goalIdx],
            solution_history: solutionHistory,
          });
        }
      }
    }

    return games;
  };

  const validateBulk = async () => {
    const games = parseBulkInput(bulkText);
    
    if (games.length === 0) {
      setMessage({ type: 'error', text: 'No valid games found. Format: start_title,goal_title,solution_history (comma-separated) or start_title|goal_title|solution_history (pipe-separated)' });
      return;
    }

    setValidating(true);
    setMessage(null);

    try {
      // Collect all unique article titles
      const allTitles = new Set();
      games.forEach(game => {
        allTitles.add(game.start_title);
        allTitles.add(game.goal_title);
        game.solution_history.forEach(title => allTitles.add(title));
      });

      // Validate all articles
      const validationResults = await validateArticles(Array.from(allTitles));
      const titleMap = new Map();
      validationResults.forEach(result => {
        titleMap.set(result.title, result);
      });

      // Map validation results to games
      const validations = games.map((game, index) => {
        const start = titleMap.get(game.start_title) || { exists: false, title: game.start_title, error: 'Not validated' };
        const goal = titleMap.get(game.goal_title) || { exists: false, title: game.goal_title, error: 'Not validated' };
        // Solution history is optional - only validate if provided
        const solutionValid = game.solution_history.length === 0 || 
          (game.solution_history.length >= 2 && 
           game.solution_history.every(title => {
             const result = titleMap.get(title);
             return result && result.exists;
           }));
        
        return {
          index,
          game,
          start,
          goal,
          solutionValid,
          valid: start.exists && goal.exists && solutionValid,
        };
      });

      setBulkValidation(validations);

      const validCount = validations.filter(v => v.valid).length;
      const invalidCount = validations.length - validCount;

      if (invalidCount === 0) {
        setMessage({ type: 'success', text: `All ${validCount} games are valid!` });
      } else {
        setMessage({ type: 'warning', text: `${validCount} valid, ${invalidCount} invalid games` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to validate articles' });
    } finally {
      setValidating(false);
    }
  };

  // Handle CSV file upload
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        setBulkText(content);
        setMessage({ type: 'success', text: 'CSV file loaded. Please validate before submitting.' });
      }
    };
    reader.readAsText(file);
  };

  // Download sample CSV
  const downloadSampleCSV = () => {
    const sampleData = [
      ['Date (Optional)', 'Start Title', 'Goal Title', 'Solution History (Optional)'],
      ['2024-01-15', 'Mars', 'Earth', '["Mars", "Planet", "Solar System", "Earth"]'],
      ['2024-01-15', 'Python (programming language)', 'JavaScript', ''],
      ['', 'Mount Everest', 'Pacific Ocean', ''],
    ];

    const csvContent = sampleData.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'practice_games_sample.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Submit single game
  const submitSingle = async () => {
    if (!singleGame.start_title || !singleGame.goal_title) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    if (!singleValidation.start?.exists || !singleValidation.goal?.exists) {
      setMessage({ type: 'error', text: 'Please validate articles first' });
      return;
    }

      const solutionHistory = parseSolutionHistory(singleGame.solution_history);
      // If empty, it will be auto-generated as [start_title, goal_title] in the backend

      setLoading(true);
      setMessage(null);

      try {
        const result = await insertPracticeGame({
          start_title: singleValidation.start.title,
          goal_title: singleValidation.goal.title,
          solution_history: solutionHistory.length > 0 ? solutionHistory : null,
          date: singleGame.date || null,
        });

      if (result.success) {
        setMessage({ type: 'success', text: 'Practice game added successfully!' });
        setSingleGame({ date: '', start_title: '', goal_title: '', solution_history: '' });
        setSingleValidation({ start: null, goal: null });
        if (onSuccess) onSuccess();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to add practice game' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add practice game' });
    } finally {
      setLoading(false);
    }
  };

  // Submit bulk games
  const submitBulk = async () => {
      const validGames = bulkValidation
      .filter(v => v.valid)
      .map(v => ({
        start_title: v.start.title,
        goal_title: v.goal.title,
        solution_history: v.game.solution_history,
        date: v.game.date || null,
      }));

    if (validGames.length === 0) {
      setMessage({ type: 'error', text: 'No valid games to submit' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await insertPracticeGamesBulk(validGames);

      if (result.success) {
        setMessage({ type: 'success', text: `Successfully added ${result.inserted} practice games!` });
        setBulkText('');
        setBulkValidation([]);
        if (onSuccess) onSuccess();
      } else {
        const errorText = result.errors?.length > 0
          ? `Failed to add some games: ${result.errors.map(e => e.error).join(', ')}`
          : 'Failed to add practice games';
        setMessage({ type: 'error', text: errorText });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add practice games' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`shadow-sm ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Manage Practice Games (Zen Mode)
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={mode === 'single' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setMode('single');
                setMessage(null);
                setBulkValidation([]);
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Single
            </Button>
            <Button
              variant={mode === 'bulk' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setMode('bulk');
                setMessage(null);
                setSingleValidation({ start: null, goal: null });
              }}
            >
              <FileText className="h-4 w-4 mr-1" />
              Bulk
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Message Display */}
        {message && (
          <div className={`p-3 rounded-lg flex items-center gap-2 ${
            message.type === 'success'
              ? theme === 'dark' ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-800'
              : message.type === 'warning'
              ? theme === 'dark' ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-50 text-yellow-800'
              : theme === 'dark' ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : message.type === 'warning' ? (
              <AlertCircle className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        {/* Single Mode */}
        {mode === 'single' && (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
              }`}>
                Date (Optional - YYYY-MM-DD)
              </label>
              <p className={`text-xs mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
              }`}>
                Leave empty to make this game always available. Set a date to show this game only on that specific date.
              </p>
              <Input
                type="date"
                value={singleGame.date}
                onChange={(e) => setSingleGame({ ...singleGame, date: e.target.value })}
                className={theme === 'dark' ? 'bg-slate-700 text-white' : ''}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
              }`}>
                Start Article *
              </label>
              <div className="flex gap-2">
                <Input
                  value={singleGame.start_title}
                  onChange={(e) => setSingleGame({ ...singleGame, start_title: e.target.value })}
                  placeholder="e.g., Mars"
                  className={theme === 'dark' ? 'bg-slate-700 text-white' : ''}
                />
                {singleValidation.start && (
                  <div className="flex items-center">
                    {singleValidation.start.exists ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {singleValidation.start && !singleValidation.start.exists && (
                <p className="text-xs text-red-500 mt-1">{singleValidation.start.error}</p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
              }`}>
                Goal Article *
              </label>
              <div className="flex gap-2">
                <Input
                  value={singleGame.goal_title}
                  onChange={(e) => setSingleGame({ ...singleGame, goal_title: e.target.value })}
                  placeholder="e.g., Earth"
                  className={theme === 'dark' ? 'bg-slate-700 text-white' : ''}
                />
                {singleValidation.goal && (
                  <div className="flex items-center">
                    {singleValidation.goal.exists ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {singleValidation.goal && !singleValidation.goal.exists && (
                <p className="text-xs text-red-500 mt-1">{singleValidation.goal.error}</p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
              }`}>
                Solution History (Optional)
              </label>
              <p className={`text-xs mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
              }`}>
                Enter the path from start to goal. Can be comma-separated (e.g., "Mars, Planet, Earth") or JSON array (e.g., ["Mars", "Planet", "Earth"]). 
                If left empty, a minimal path [start, goal] will be created automatically.
              </p>
              <Input
                value={singleGame.solution_history}
                onChange={(e) => setSingleGame({ ...singleGame, solution_history: e.target.value })}
                placeholder='e.g., "Mars, Planet, Earth" or ["Mars", "Planet", "Earth"]'
                className={theme === 'dark' ? 'bg-slate-700 text-white' : ''}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={validateSingle}
                disabled={validating || !singleGame.start_title || !singleGame.goal_title}
                variant="outline"
                className="flex-1"
              >
                {validating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Validating...
                  </>
                ) : (
                  'Validate Articles'
                )}
              </Button>
              <Button
                onClick={submitSingle}
                disabled={loading || !singleValidation.start?.exists || !singleValidation.goal?.exists}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Practice Game'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Bulk Mode */}
        {mode === 'bulk' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={downloadSampleCSV}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Sample CSV
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload CSV File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
              }`}>
                Bulk Input (CSV format or pipe-separated)
              </label>
              <p className={`text-xs mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
              }`}>
                Format: date (optional),start_title,goal_title,solution_history (optional) (comma-separated) or date (optional)|start_title|goal_title|solution_history (optional) (pipe-separated)
                <br />
                Date and solution_history are optional. Leave date empty to make game always available. Leave solution_history empty to auto-generate minimal path.
                <br />
                Examples: "2024-01-15,Mars,Earth,\"Mars, Planet, Earth\"" or "Mars,Earth" (no date, no solution) or "Mars,Earth,\"Mars, Planet, Earth\"" (no date)
              </p>
              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder='2024-01-15,Mars,Earth,"Mars, Planet, Earth"&#10;2024-01-15,Python (programming language),JavaScript&#10;Mount Everest,Pacific Ocean'
                rows={10}
                className={`w-full p-3 rounded border ${
                  theme === 'dark'
                    ? 'bg-slate-700 text-white border-slate-600'
                    : 'bg-white text-slate-900 border-slate-300'
                } font-mono text-sm`}
              />
            </div>

            {bulkValidation.length > 0 && (
              <div className={`p-3 rounded border ${
                theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-300'
              }`}>
                <div className={`text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
                }`}>
                  Validation Results:
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {bulkValidation.map((v, idx) => (
                    <div key={idx} className={`text-xs flex items-center gap-2 ${
                      v.valid
                        ? theme === 'dark' ? 'text-green-400' : 'text-green-700'
                        : theme === 'dark' ? 'text-red-400' : 'text-red-700'
                    }`}>
                      {v.valid ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      <span>
                        {v.game.start_title} → {v.game.goal_title}
                        {!v.start.exists && ` (Start: ${v.start.error})`}
                        {!v.goal.exists && ` (Goal: ${v.goal.error})`}
                        {!v.solutionValid && ' (Invalid solution history)'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={validateBulk}
                disabled={validating || !bulkText.trim()}
                variant="outline"
                className="flex-1"
              >
                {validating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Validating...
                  </>
                ) : (
                  'Validate All'
                )}
              </Button>
              <Button
                onClick={submitBulk}
                disabled={loading || bulkValidation.filter(v => v.valid).length === 0}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  `Add ${bulkValidation.filter(v => v.valid).length || ''} Valid Games`
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

