export interface ColumnConfig<T> {
    key: keyof T;
    label: string;
    render?: (value: any, row: T) => React.ReactNode;
  }
  
  export interface TableWrapperProps<T = any> {
    columns: ColumnConfig<T>[];
    rows: T[];
    totalCount: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: unknown, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isLoading?: boolean;
    isError?: boolean;
    onActionClick?: (action: "Update" | "Delete", id: string) => void;
    filterComponent?: React.ReactNode;
    searchValue?: string;
    onSearchChange: (e: string) => void;
  }
  