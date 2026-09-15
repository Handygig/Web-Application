import React, { forwardRef, useState, useEffect } from 'react';
import { Popover } from '@headlessui/react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import dayjs from 'dayjs';

export default forwardRef(function Datepicker(
  {
    label,
    id,
    required = false,
    error,
    className = '',
    type = 'date',
    value,
    onChange,
    minDate,
    maxDate,
    ...props
  },
  ref
) {
  const isTime = type === 'time';
  const isDateTime = type === 'datetime-local';
  const isDate = type === 'date';

  const minDayjs = minDate ? dayjs(minDate) : null;
  const maxDayjs = maxDate ? dayjs(maxDate) : null;

  const [currentDate, setCurrentDate] = useState(() => {
    if (value) {
      if (isTime) return dayjs(`2000-01-01T${value}`);
      return dayjs(value);
    }
    return dayjs();
  });

  const [viewDate, setViewDate] = useState(() => currentDate);

  const [hourInput, setHourInput] = useState(currentDate.format('hh'));
  const [minuteInput, setMinuteInput] = useState(currentDate.format('mm'));

  useEffect(() => {
    setHourInput(currentDate.format('hh'));
    setMinuteInput(currentDate.format('mm'));
  }, [currentDate]);

  useEffect(() => {
    if (value) {
      const newDate = isTime ? dayjs(`2000-01-01T${value}`) : dayjs(value);
      if (newDate.isValid()) {
        setCurrentDate(newDate);
        setViewDate(newDate);
      }
    }
  }, [value, isTime]);

  const updateValue = (newDate) => {
    setCurrentDate(newDate);
    if (onChange) {
      let formattedDate = '';
      if (isDateTime) {
        formattedDate = newDate.format('YYYY-MM-DDTHH:mm:ss');
      } else if (isTime) {
        formattedDate = newDate.format('HH:mm:ss');
      } else {
        formattedDate = newDate.format('YYYY-MM-DD');
      }
      onChange({ target: { value: formattedDate, id, name: id } });
    }
  };

  const handleDateClick = (day, close) => {
    let newDate = currentDate.year(day.year()).month(day.month()).date(day.date());
    if (minDayjs && newDate.isBefore(minDayjs)) {
      newDate = minDayjs;
    }
    if (maxDayjs && newDate.isAfter(maxDayjs)) {
      newDate = maxDayjs;
    }
    updateValue(newDate);
    if (isDate && close) {
      close();
    }
  };

  const updateTime = (unit, val) => {
    let newDate = currentDate;
    if (unit === 'hour') {
      let newHour = parseInt(val, 10);
      const isPM = currentDate.format('A') === 'PM';
      if (isPM && newHour < 12) newHour += 12;
      if (!isPM && newHour === 12) newHour = 0;
      newDate = currentDate.hour(newHour);
    } else if (unit === 'minute') {
      newDate = currentDate.minute(parseInt(val, 10));
    } else if (unit === 'second') {
      newDate = currentDate.second(parseInt(val, 10));
    } else if (unit === 'period') {
      const currentHour = currentDate.hour();
      if (val === 'PM' && currentHour < 12) {
        newDate = currentDate.hour(currentHour + 12);
      } else if (val === 'AM' && currentHour >= 12) {
        newDate = currentDate.hour(currentHour - 12);
      }
    }

    if (minDayjs && newDate.isBefore(minDayjs)) {
      newDate = minDayjs;
    }
    if (maxDayjs && newDate.isAfter(maxDayjs)) {
      newDate = maxDayjs;
    }
    updateValue(newDate);
  };

  // Calendar logic
  const startOfMonth = viewDate.startOf('month');
  const endOfMonth = viewDate.endOf('month');
  const startDate = startOfMonth.startOf('week');
  const endDate = endOfMonth.endOf('week');

  const calendarDays = [];
  let day = startDate;
  while (day.isBefore(endDate) || day.isSame(endDate, 'day')) {
    calendarDays.push(day);
    day = day.add(1, 'day');
  }

  const prevMonth = () => setViewDate(viewDate.subtract(1, 'month'));
  const nextMonth = () => setViewDate(viewDate.add(1, 'month'));

  const displayFormat = isDateTime ? 'MMMM D, YYYY h:mm A' : isTime ? 'h:mm A' : 'MMMM D, YYYY';

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              ref={ref}
              className={`flex w-full items-center gap-2 rounded-[4px] border bg-transparent px-4 py-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-theme-accent transition-all ${
                error
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                  : 'border-[#7A7E884D] focus:border-theme-accent'
              }`}
            >
              <CalendarIcon className="h-4 w-4 text-slate-400" />
              <span className={value ? 'text-slate-700' : 'text-slate-400'}>
                {value ? currentDate.format(displayFormat) : 'Pick a date'}
              </span>
            </Popover.Button>

            <Popover.Panel
              anchor="bottom start"
              transition
              className="w-[280px] rounded-xl border border-slate-200 bg-white p-4 text-slate-700 shadow-2xl z-50 [--anchor-gap:8px] transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
            >
              {!isTime && (
                <div className="mb-4">
                  <div className="mb-4 flex items-center justify-between px-1">
                    <button
                      type="button"
                      onClick={prevMonth}
                      className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100 transition-colors text-slate-600"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-[15px] font-semibold text-slate-800">
                      {viewDate.format('MMMM YYYY')}
                    </span>
                    <button
                      type="button"
                      onClick={nextMonth}
                      className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100 transition-colors text-slate-600"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mb-2 grid grid-cols-7 text-center">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                      <div key={d} className="text-xs font-semibold text-slate-400">
                        {d}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-y-1">
                    {calendarDays.map((d, i) => {
                      const isCurrentMonth = d.month() === viewDate.month();
                      const isSelected = d.isSame(currentDate, 'day') && value;
                      const isBeforeMin = minDayjs ? d.isBefore(minDayjs, 'day') : false;
                      const isAfterMax = maxDayjs ? d.isAfter(maxDayjs, 'day') : false;
                      const isDisabled = isBeforeMin || isAfterMax;

                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => handleDateClick(d, close)}
                          className={`mx-auto flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors ${
                            isDisabled
                              ? 'text-slate-200 cursor-not-allowed'
                              : !isCurrentMonth
                                ? 'text-slate-300 hover:text-slate-400'
                                : 'text-slate-700 hover:bg-slate-100'
                          } ${isSelected && !isDisabled ? 'bg-theme-accent text-white font-medium hover:bg-theme-accent/90' : ''}`}
                        >
                          {d.date()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {isDateTime && <div className="my-4 h-px w-full bg-slate-200" />}

              {(isTime || isDateTime) && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-500">Hours</label>
                    <input
                      type="text"
                      value={hourInput}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                        setHourInput(val);
                      }}
                      onBlur={() => {
                        let num = parseInt(hourInput, 10);
                        if (isNaN(num) || num < 1 || num > 12) {
                          num = 12;
                        }
                        const formatted = num.toString().padStart(2, '0');
                        setHourInput(formatted);
                        updateTime('hour', formatted);
                      }}
                      className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-center text-sm text-slate-800 focus:border-theme-accent focus:outline-none focus:ring-0"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-500">Minutes</label>
                    <input
                      type="text"
                      value={minuteInput}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                        setMinuteInput(val);
                      }}
                      onBlur={() => {
                        let num = parseInt(minuteInput, 10);
                        if (isNaN(num) || num < 0 || num > 59) {
                          num = 59;
                        }
                        const formatted = num.toString().padStart(2, '0');
                        setMinuteInput(formatted);
                        updateTime('minute', formatted);
                      }}
                      className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-center text-sm text-slate-800 focus:border-theme-accent focus:outline-none focus:ring-0"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-500 text-center">Period</label>
                    <div className="flex h-[34px] rounded-md bg-slate-100 p-0.5">
                      <button
                        type="button"
                        onClick={() => updateTime('period', 'AM')}
                        className={`flex-1 rounded-[4px] text-xs font-medium transition-colors ${
                          currentDate.format('A') === 'AM'
                            ? 'bg-theme-accent text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        AM
                      </button>
                      <button
                        type="button"
                        onClick={() => updateTime('period', 'PM')}
                        className={`flex-1 rounded-[4px] text-xs font-medium transition-colors ${
                          currentDate.format('A') === 'PM'
                            ? 'bg-theme-accent text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        PM
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Popover.Panel>
          </>
        )}
      </Popover>

      {error && <span className="text-xs font-medium text-red-500">{error}</span>}
    </div>
  );
});
