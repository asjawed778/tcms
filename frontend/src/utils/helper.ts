import * as yup from "yup";

export type Cleanable =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | Cleanable[]
  | { [key: string]: Cleanable };

export const cleanData = <T>(payload: T): T | undefined => {
  if (payload === null || payload === undefined || payload === '') {
    return undefined;
  }

  if (payload instanceof Date) {
    return payload;
  }

  if (Array.isArray(payload)) {
    const cleanedArray = payload
      .map(item => cleanData(item))
      .filter(
        item =>
          item !== undefined &&
          !(typeof item === 'object' && item !== null && Object.keys(item).length === 0)
      );

    return cleanedArray.length > 0 ? (cleanedArray as unknown as T) : undefined;
  }

  if (typeof payload === 'object') {
    const cleanedObj: Record<string, any> = {};

    for (const [key, value] of Object.entries(payload)) {
      const cleanedValue = cleanData(value);
      if (cleanedValue !== undefined) {
        cleanedObj[key] = cleanedValue;
      }
    }

    return Object.keys(cleanedObj).length > 0 ? (cleanedObj as T) : undefined;
  }

  return payload;
};

export const validateGroupFields = (
  testName: string,
  errorMessage: string,
  groupFields: string[]
) => {
  return yup
    .string()
    .nullable()
    .test(testName, errorMessage, function () {
      const parent = this.parent;
      const currentField = this.path.split('.').pop(); // field like 'name', 'address'

      const trimmedValues = groupFields.map((key) => (parent[key]?.trim?.() ?? ""));
      const anyFilled = trimmedValues.some((val) => val !== "");
      const currentValue = parent[currentField!]?.trim?.() ?? "";
      if (!anyFilled) return true;
      return currentValue !== "";
    });
};

export const formatTime = (hour: number, minute: number) =>
  `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

const excelSerialDateToJSDate = (serial: number) => {
  // Excel counts from 1900-01-01
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400; 
  const date_info = new Date(utc_value * 1000);
  return new Date(
    date_info.getFullYear(),
    date_info.getMonth(),
    date_info.getDate()
  );
};

export const convertExcelDOBToISO = (
  dob: string | number | Date | null | undefined
) => {
  if (!dob) return null;

  let dateObj: Date;

  if (dob instanceof Date) {
    dateObj = dob;
  } else if (typeof dob === "number") {
    // Excel numeric date
    dateObj = excelSerialDateToJSDate(dob);
  } else if (typeof dob === "string") {
    // Expecting format "DD/MM/YYYY"
    const [dayStr, monthStr, yearStr] = dob.split("/");
    const day = Number(dayStr);
    const month = Number(monthStr) - 1;
    const year = Number(yearStr);
    if (!day || !monthStr || !year) return null;
    dateObj = new Date(year, month, day);
  } else {
    return null;
  }

  // Convert to ISO in UTC without timezone shift
  return new Date(
    Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate())
  ).toISOString();
};


// helper.ts
export const unflattenObject = (data: Record<string, any>) => {
  const result: Record<string, any> = {};
  for (const key in data) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) continue;

    const value = data[key];
    const keys = key.split(".");
    let current = result;

    keys.forEach((k, index) => {
      if (index === keys.length - 1) {
        current[k] = value;
      } else {
        current[k] = current[k] || {};
        current = current[k];
      }
    });
  }
  return result;
};

/**
 * Utility to convert array of objects into dropdown-friendly { label, value } pairs
 */
interface MapToDropdownOptionsParams<T> {
  data?: T[];
  labelKey?: keyof T;
  valueKey?: keyof T;
}
export function mapToDropdownOptions<T extends Record<string, any>>({
  data = [],
  labelKey = "name" as keyof T,
  valueKey = "_id" as keyof T,
}: MapToDropdownOptionsParams<T>): DropdownOption[] {
  return data.map((item) => ({
    label: String(item[labelKey]),
    value: String(item[valueKey]),
  }));
}

export default mapToDropdownOptions;


// utils/formatDate.ts
import { format, parseISO, isValid } from "date-fns";

/**
 * Converts ISO date string (or any valid date) to custom format
 * @param dateStr - ISO string like "2025-06-15T10:30:00Z" or "2025-06-15"
 * @param formatStr - Desired format (e.g. "dd MMM yyyy", "MM/dd/yyyy")
 * @param fallback - What to return if date is invalid (default: "--")
 * @returns Formatted date string
 */
export const formatDate = (
  dateStr: string | Date | null | undefined,
  formatStr: string = "dd MMM yyyy",
  fallback: string = "--"
): string => {
  if (!dateStr) return fallback;

  let date: Date;

  // Handle string input
  if (typeof dateStr === "string") {
    // Try parsing ISO string
    try {
      date = parseISO(dateStr);
    } catch {
      // Fallback: try direct Date parsing
      date = new Date(dateStr);
    }
  } 
  // Handle Date object
  else if (dateStr instanceof Date) {
    date = dateStr;
  } 
  // Invalid type
  else {
    return fallback;
  }

  // Check if date is valid
  if (!isValid(date)) return fallback;

  try {
    return format(date, formatStr);
  } catch {
    return fallback;
  }
};

// yyyy-mm-dd
export const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};