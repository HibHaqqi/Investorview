'use client';

import * as React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';

type Column<T> = {
  accessorKey: keyof T | ((row: T) => any);
  header: React.ReactNode | (({ column }: { column: Column<T> }) => React.ReactNode);
  cell?: (props: { row: T }) => React.ReactNode;
  enableSorting?: boolean;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  filterColumn?: keyof T;
};

export function DataTable<T>({ columns, data, filterColumn }: DataTableProps<T>) {
  const [filter, setFilter] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof T | ((row: T) => any);
    direction: 'ascending' | 'descending';
  } | null>(null);

  const sortedData = React.useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = typeof sortConfig.key === 'function' ? sortConfig.key(a) : a[sortConfig.key];
        const bValue = typeof sortConfig.key === 'function' ? sortConfig.key(b) : b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const filteredData = React.useMemo(() => {
    if (!filter || !filterColumn) return sortedData;
    return sortedData.filter((item) => {
        const value = item[filterColumn as keyof T];
        return String(value).toLowerCase().includes(filter.toLowerCase());
    });
  }, [sortedData, filter, filterColumn]);

  const requestSort = (key: keyof T | ((row: T) => any)) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  return (
    <div className="space-y-4">
      {filterColumn && (
         <Input
            placeholder={`Filter by ${String(filterColumn)}...`}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
        />
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index}>
                  {typeof column.header === 'function' ? (
                     column.header({ column })
                  ) : column.enableSorting ? (
                    <Button variant="ghost" onClick={() => requestSort(column.accessorKey)}>
                      {column.header}
                      {sortConfig?.key === column.accessorKey ? (
                        sortConfig.direction === 'ascending' ? (
                          <ChevronUp className="ml-2 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-2 h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </Button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length ? (
              filteredData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {column.cell
                        ? column.cell({ row })
                        : typeof column.accessorKey === 'function'
                        ? column.accessorKey(row)
                        : String(row[column.accessorKey as keyof T] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
