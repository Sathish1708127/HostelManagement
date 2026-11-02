import React, { useState } from 'react';

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  label?: string;
  placeholder?: string;
  error?: string;
}

/**
 * DatePicker Component
 * Reusable calendar date picker with month/year navigation
 */
export function DatePicker({
  value,
  onChange,
  minDate,
  maxDate,
  label,
  placeholder = 'Select date',
  error,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [month, setMonth] = useState(value?.getMonth() ?? new Date().getMonth());
  const [year, setYear] = useState(value?.getFullYear() ?? new Date().getFullYear());

  const getDaysInMonth = (m: number, y: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDay = (m: number, y: number) => new Date(y, m, 1).getDay();

  const days: (number | null)[] = [];
  const firstDay = getFirstDay(month, year);
  const daysInMonth = getDaysInMonth(month, year);

  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const handleSelectDate = (day: number) => {
    const newDate = new Date(year, month, day);
    onChange(newDate);
    setIsOpen(false);
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(year, month, day);
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const formattedDate = value?.toLocaleDateString() ?? '';

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <input
        type="text"
        value={formattedDate}
        placeholder={placeholder}
        onClick={() => setIsOpen(!isOpen)}
        readOnly
        className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        }`}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 z-50 w-72">
          <div className="flex justify-between items-center mb-4 gap-2">
            <button
              type="button"
              onClick={() => setMonth(month === 0 ? 11 : month - 1)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              ←
            </button>

            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 10 + i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="border rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {[
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ].map((m, i) => (
                <option key={i} value={i}>
                  {m}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setMonth(month === 11 ? 0 : month + 1)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <div
                key={d}
                className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => day && handleSelectDate(day)}
                disabled={!day || isDateDisabled(day)}
                className={`p-2 text-sm rounded ${
                  !day
                    ? 'text-gray-300 cursor-default'
                    : isDateDisabled(day)
                    ? 'text-gray-400 cursor-not-allowed'
                    : value?.getDate() === day &&
                      value?.getMonth() === month &&
                      value?.getFullYear() === year
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
