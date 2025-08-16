'use client';

import type { Bond } from '@/lib/types';
import { format } from 'date-fns';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

export const columns: ({
    accessorKey: keyof Bond | ((row: Bond) => any);
    header: any;
    cell?: ({ row }: { row: Bond; }) => any;
    enableSorting?: boolean;
})[] = [
  { accessorKey: 'name', header: 'Bond Name', enableSorting: true },
  { accessorKey: 'quantity', header: 'Quantity', enableSorting: true },
  { 
    accessorKey: 'currentPrice', 
    header: 'Current Price',
    cell: ({ row }) => formatCurrency(row.currentPrice),
    enableSorting: true 
  },
  {
    accessorKey: (row) => row.quantity * row.currentPrice,
    header: 'Total Value',
    cell: ({ row }) => formatCurrency(row.quantity * row.currentPrice),
    enableSorting: true,
  },
  { 
    accessorKey: 'couponRate', 
    header: 'Coupon (%)', 
    cell: ({ row }) => `${row.couponRate.toFixed(2)}%`,
    enableSorting: true 
  },
  { 
    accessorKey: 'maturityDate', 
    header: 'Maturity Date',
    cell: ({ row }) => format(new Date(row.maturityDate), 'MMM d, yyyy'),
    enableSorting: true 
  },
];
