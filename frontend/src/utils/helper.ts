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

export const cleanData = <T extends Cleanable>(payload: T): T | undefined => {
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







