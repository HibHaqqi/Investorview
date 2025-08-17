'use client';

import type { Transaction } from '@/lib/types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const TypeCell = ({ row }: { row: Transaction }) => {
    let color = '';
    switch (row.type) {
        case 'Buy': color = 'text-blue-600'; break;
        case 'Sell': color = 'text-red-600'; break;
        case 'Deposit': color = 'text-green-600'; break;
        case 'Withdrawal': color = 'text-orange-600'; break;
    }
    return (
      <span className={`font-medium ${color}`}>
        {row.type}
      </span>
    );
}

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
    cell: ({ row }) => row.assetName || 'N/A',
    enableSorting: true
  },
  { 
    accessorKey: 'assetType', 
    header: 'Asset Type',
    cell: ({ row }) => row.assetType ? <Badge variant="secondary">{row.assetType}</Badge> : 'N/A',
    enableSorting: true
  },
  { 
    accessorKey: 'type', 
    header: 'Type',
    cell: TypeCell,
    enableSorting: true
  },
  { 
    accessorKey: 'quantity', 
    header: 'Quantity',
    cell: ({ row }) => row.quantity || 'N/A',
    enableSorting: true
  },
  { 
    accessorKey: 'price', 
    header: 'Price',
    cell: ({ row }) => row.price ? formatCurrency(row.price) : 'N/A',
    enableSorting: true
  },
  { 
    accessorKey: 'totalAmount', 
    header: 'Total Amount',
    cell: ({ row }) => formatCurrency(row.totalAmount),
    enableSorting: true
  },
];
