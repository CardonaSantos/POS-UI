"use client";

import { Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import { es } from "date-fns/locale";
import { DateSide } from "./ticket-filters.types";
import "react-datepicker/dist/react-datepicker.css";

interface FilterDateRangeProps {
  dateRangeStart: Date | undefined;
  dateRangeEnd: Date | undefined;
  onChangeDates: (side: DateSide, date: Date | null) => void;
}

export function FilterDateRange({
  dateRangeStart,
  dateRangeEnd,
  onChangeDates,
}: FilterDateRangeProps) {
  return (
    <div className="flex items-center h-7 border border-gray-200 rounded bg-white overflow-visible shrink-0">
      <span className="px-1.5 border-r border-gray-100 h-full flex items-center">
        <Calendar className="h-3 w-3 text-gray-400" />
      </span>
      <DatePicker
        locale={es}
        selected={dateRangeStart ?? null}
        onChange={(date) => onChangeDates("start", date)}
        selectsStart
        startDate={dateRangeStart}
        endDate={dateRangeEnd}
        placeholderText="Desde"
        className="w-[72px] h-full border-none text-[11px] text-center focus:outline-none bg-transparent cursor-pointer text-gray-700 placeholder:text-gray-400"
        dateFormat="dd/MM/yy"
      />
      <span className="text-gray-300 text-[10px] px-0.5">–</span>
      <DatePicker
        locale={es}
        selected={dateRangeEnd ?? null}
        onChange={(date) => onChangeDates("end", date)}
        selectsEnd
        startDate={dateRangeStart}
        endDate={dateRangeEnd}
        minDate={dateRangeStart}
        placeholderText="Hasta"
        className="w-[72px] h-full border-none text-[11px] text-center focus:outline-none bg-transparent cursor-pointer text-gray-700 placeholder:text-gray-400"
        dateFormat="dd/MM/yy"
      />
    </div>
  );
}
