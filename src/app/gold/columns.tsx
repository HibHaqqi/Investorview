'use client';

import type { Gold } from '@/lib/types';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const PnLCell = ({ row }: { row: Gold }) => {
    const currentValue = row.grams * row.currentPricePerGram;
    const investedValue = row.grams * row.purchasePricePerGram;
    const pnl = currentValue - investedValue;
    const isPositive = pnl >= 0;

    return (
        <div className={`flex items-center font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUpRight className="mr-1 h-4 w-4" /> : <ArrowDownRight className="mr-1 h-4 w-4" />}
            {formatCurrency(pnl)}
        </div>
    );
};

export const columns: ({
    accessorKey: keyof Gold | ((row: Gold) => any);
    header: any;
    cell?: ({ row }: { row: Gold; }) => any;
    enableSorting?: boolean;
})[] = [
  { accessorKey: 'name', header: 'Investment Name', enableSorting: true },
  { accessorKey: 'grams', header: 'Grams', enableSorting: true },
  { 
    accessorKey: 'currentPricePerGram', 
    header: 'Current Price/Gram',
    cell: ({ row }) => formatCurrency(row.currentPricePerGram),
    enableSorting: true
  },
  {
    accessorKey: (row) => row.grams * row.currentPricePerGram,
    header: 'Total Value',
    cell: ({ row }) => formatCurrency(row.grams * row.currentPricePerGram),
    enableSorting: true,
  },
  {
    accessorKey: (row) => (row.grams * row.currentPricePerGram) - (row.grams * row.purchasePricePerGram),
    header: 'P/L',
    cell: PnLCell,
    enableSorting: true,
  },
];
