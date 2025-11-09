// Daily Challenge Management Component for Admin Dashboard

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/contexts/ThemeContext';
import { checkArticleExists, validateArticles } from '@/lib/wikipediaValidation';
import { insertDailyChallenge, insertDailyChallengesBulk } from '@/lib/adminDailyChallenges';
import { Loader2, Plus, FileText, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export function DailyChallengeManager({ onSuccess }) {
  const { theme } = useTheme();
  const [mode, setMode] = useState('single'); // 'single' or 'bulk'
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [message, setMessage] = useState(null);

  // Single mode state
  const [singleChallenge, setSingleChallenge] = useState({
    date: '',
    start_title: '',
    goal_title: '',
    hint: '',
  });
  const [singleValidation, setSingleValidation] = useState({
    start: null,
    goal: null,
  });

  // Bulk mode state
  const [bulkText, setBulkText] = useState('');
  const [bulkValidation, setBulkValidation] = useState([]);

  // Validate single challenge articles
  const validateSingle = async () => {
    if (!singleChallenge.start_title || !singleChallenge.goal_title) {
      setMessage({ type: 'error', text: 'Please enter both start and goal articles' });
      return;
    }

    setValidating(true);
    setMessage(null);

    try {
      const [startResult, goalResult] = await Promise.all([
        checkArticleExists(singleChallenge.start_title),
        checkArticleExists(singleChallenge.goal_title),
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

  // Parse and validate bulk input
  const parseBulkInput = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    const challenges = [];

    for (const line of lines) {
      // Format: date|start_title|goal_title|hint (hint optional)
      const parts = line.split('|').map(p => p.trim());
      if (parts.length >= 3) {
        challenges.push({
          date: parts[0],
          start_title: parts[1],
          goal_title: parts[2],
          hint: parts[3] || null,
        });
      }
    }

    return challenges;
  };

  const validateBulk = async () => {
    const challenges = parseBulkInput(bulkText);
    
    if (challenges.length === 0) {
      setMessage({ type: 'error', text: 'No valid challenges found. Format: date|start_title|goal_title|hint' });
      return;
    }

    setValidating(true);
    setMessage(null);

    try {
      // Collect all unique article titles
      const allTitles = new Set();
      challenges.forEach(ch => {
        allTitles.add(ch.start_title);
        allTitles.add(ch.goal_title);
      });

      // Validate all articles
      const validationResults = await validateArticles(Array.from(allTitles));
      const titleMap = new Map();
      validationResults.forEach(result => {
        titleMap.set(result.title, result);
      });

      // Map validation results to challenges
      const validations = challenges.map((ch, index) => ({
        index,
        challenge: ch,
        start: titleMap.get(ch.start_title) || { exists: false, title: ch.start_title, error: 'Not validated' },
        goal: titleMap.get(ch.goal_title) || { exists: false, title: ch.goal_title, error: 'Not validated' },
        valid: false,
      }));

      validations.forEach(v => {
        v.valid = v.start.exists && v.goal.exists;
      });

      setBulkValidation(validations);

      const validCount = validations.filter(v => v.valid).length;
      const invalidCount = validations.length - validCount;

      if (invalidCount === 0) {
        setMessage({ type: 'success', text: `All ${validCount} challenges are valid!` });
      } else {
        setMessage({ type: 'warning', text: `${validCount} valid, ${invalidCount} invalid challenges` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to validate articles' });
    } finally {
      setValidating(false);
    }
  };

  // Submit single challenge
  const submitSingle = async () => {
    if (!singleChallenge.date || !singleChallenge.start_title || !singleChallenge.goal_title) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    if (!singleValidation.start?.exists || !singleValidation.goal?.exists) {
      setMessage({ type: 'error', text: 'Please validate articles first' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await insertDailyChallenge({
        date: singleChallenge.date,
        start_title: singleValidation.start.title, // Use validated title
        goal_title: singleValidation.goal.title,
        hint: singleChallenge.hint || null,
      });

      if (result.success) {
        setMessage({ type: 'success', text: 'Challenge added successfully!' });
        setSingleChallenge({ date: '', start_title: '', goal_title: '', hint: '' });
        setSingleValidation({ start: null, goal: null });
        if (onSuccess) onSuccess();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to add challenge' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add challenge' });
    } finally {
      setLoading(false);
    }
  };

  // Submit bulk challenges
  const submitBulk = async () => {
    const validChallenges = bulkValidation
      .filter(v => v.valid)
      .map(v => ({
        date: v.challenge.date,
        start_title: v.start.title, // Use validated title
        goal_title: v.goal.title,
        hint: v.challenge.hint || null,
      }));

    if (validChallenges.length === 0) {
      setMessage({ type: 'error', text: 'No valid challenges to submit' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await insertDailyChallengesBulk(validChallenges);

      if (result.success) {
        setMessage({ type: 'success', text: `Successfully added ${result.inserted} challenges!` });
        setBulkText('');
        setBulkValidation([]);
        if (onSuccess) onSuccess();
      } else {
        const errorText = result.errors?.length > 0
          ? `Failed to add some challenges: ${result.errors.map(e => e.error).join(', ')}`
          : 'Failed to add challenges';
        setMessage({ type: 'error', text: errorText });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add challenges' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`shadow-sm ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Add Daily Challenge
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
                Date (YYYY-MM-DD) *
              </label>
              <Input
                type="date"
                value={singleChallenge.date}
                onChange={(e) => setSingleChallenge({ ...singleChallenge, date: e.target.value })}
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
                  value={singleChallenge.start_title}
                  onChange={(e) => setSingleChallenge({ ...singleChallenge, start_title: e.target.value })}
                  placeholder="e.g., Albert Einstein"
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
                  value={singleChallenge.goal_title}
                  onChange={(e) => setSingleChallenge({ ...singleChallenge, goal_title: e.target.value })}
                  placeholder="e.g., Quantum mechanics"
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
                Hint (Optional)
              </label>
              <Input
                value={singleChallenge.hint}
                onChange={(e) => setSingleChallenge({ ...singleChallenge, hint: e.target.value })}
                placeholder="Optional hint for players"
                className={theme === 'dark' ? 'bg-slate-700 text-white' : ''}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={validateSingle}
                disabled={validating || !singleChallenge.start_title || !singleChallenge.goal_title}
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
                  'Add Challenge'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Bulk Mode */}
        {mode === 'bulk' && (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
              }`}>
                Bulk Input (one per line)
              </label>
              <p className={`text-xs mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
              }`}>
                Format: date|start_title|goal_title|hint (hint is optional)
                <br />
                Example: 2024-01-15|Albert Einstein|Quantum mechanics|Physics connection
              </p>
              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="2024-01-15|Albert Einstein|Quantum mechanics|Physics connection&#10;2024-01-16|Paris|Eiffel Tower|Famous landmark"
                rows={8}
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
                        {v.challenge.date}: {v.challenge.start_title} → {v.challenge.goal_title}
                        {!v.start.exists && ` (Start: ${v.start.error})`}
                        {!v.goal.exists && ` (Goal: ${v.goal.error})`}
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
                  `Add ${bulkValidation.filter(v => v.valid).length || ''} Valid Challenges`
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

