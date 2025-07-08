import React from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import "./Table.css";

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  accessor?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (key: string) => void;
  onRowClick?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
}

export function Table<T>({
  data,
  columns,
  sortBy,
  sortOrder,
  onSort,
  onRowClick,
  loading = false,
  emptyMessage = "No data available",
  className = "",
  striped = true,
  hoverable = true,
  compact = false,
}: TableProps<T>) {
  const getSortIcon = (columnKey: string) => {
    if (sortBy !== columnKey) {
      return <FaSort className="sort-icon" />;
    }
    return sortOrder === "asc" ? (
      <FaSortUp className="sort-icon active" />
    ) : (
      <FaSortDown className="sort-icon active" />
    );
  };

  const getCellValue = (item: T, column: TableColumn<T>) => {
    if (column.accessor) {
      return column.accessor(item);
    }
    return item[column.key as keyof T] as React.ReactNode;
  };

  const handleSort = (columnKey: string) => {
    if (onSort) {
      onSort(columnKey);
    }
  };

  const handleRowClick = (item: T) => {
    if (onRowClick) {
      onRowClick(item);
    }
  };

  const tableClasses = [
    "table",
    striped && "table-striped",
    hoverable && "table-hoverable",
    compact && "table-compact",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (loading) {
    return (
      <div className="table-container">
        <div className="table-loading">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="table-container">
        <div className="table-empty">
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className={tableClasses}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`table-header ${column.className || ""}`}
                style={{
                  width: column.width,
                  textAlign: column.align || "left",
                  cursor: column.sortable ? "pointer" : "default",
                }}
                onClick={() =>
                  column.sortable && handleSort(column.key as string)
                }
              >
                <div className="table-header-content">
                  <span>{column.header}</span>
                  {column.sortable && getSortIcon(column.key as string)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              className={`table-row ${onRowClick ? "table-row-clickable" : ""}`}
              onClick={() => handleRowClick(item)}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={`table-cell ${column.className || ""}`}
                  style={{
                    textAlign: column.align || "left",
                  }}
                >
                  {getCellValue(item, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
