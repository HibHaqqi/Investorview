'use client';

import type { Transaction } from '@/lib/types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

export const columns: ({
    accessorKey: keyof Transaction | ((row: Transaction) => any);
    header: any;
    cell?: ({ row }: { row: Transaction; }) => any;
    enableSorting?: boolean;
})[] = [
  { 
    accessorKey: 'date', 
    header: 'Date',
    cell: ({ row }) => format(new Date(row.date), 'MMM d, yyyy'),
    enableSorting: true
  },
  { 
    accessorKey: 'assetName', 
    header: 'Asset', 
    enableSorting: true
  },
  { 
    accessorKey: 'assetType', 
    header: 'Asset Type',
    cell: ({ row }) => <Badge variant="secondary">{row.assetType}</Badge>,
    enableSorting: true
  },
  { 
    accessorKey: 'type', 
    header: 'Type',
    cell: ({ row }) => (
      <span className={`font-medium ${row.type === 'Buy' ? 'text-green-600' : 'text-red-600'}`}>
        {row.type}
      </span>
    ),
    enableSorting: true
  },
  { 
    accessorKey: 'quantity', 
    header: 'Quantity', 
    enableSorting: true
  },
  { 
    accessorKey: 'price', 
    header: 'Price',
    cell: ({ row }) => formatCurrency(row.price),
    enableSorting: true
  },
  { 
    accessorKey: 'totalAmount', 
    header: 'Total Amount',
    cell: ({ row }) => formatCurrency(row.totalAmount),
    enableSorting: true
  },
];
