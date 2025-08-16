'use client';

import type { Stock } from '@/lib/types';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const PnLCell = ({ row }: { row: Stock }) => {
    const totalValue = row.shares * row.currentPrice;
    const investedValue = row.shares * row.avgPrice;
    const pnl = totalValue - investedValue;
    const pnlPercent = (pnl / investedValue) * 100;
    const isPositive = pnl >= 0;

    return (
        <div className={`flex flex-col font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <span className="flex items-center">
                {isPositive ? <ArrowUpRight className="mr-1 h-4 w-4" /> : <ArrowDownRight className="mr-1 h-4 w-4" />}
                {formatCurrency(pnl)}
            </span>
            <span className="text-xs text-muted-foreground ml-5">{pnlPercent.toFixed(2)}%</span>
        </div>
    );
};

export const columns: ({
    accessorKey: keyof Stock | ((row: Stock) => any);
    header: any;
    cell?: ({ row }: { row: Stock; }) => JSX.Element;
    enableSorting?: boolean;
})[] = [
  { accessorKey: 'ticker', header: 'Ticker', enableSorting: true },
  { accessorKey: 'name', header: 'Company Name', enableSorting: true },
  { accessorKey: 'shares', header: 'Shares', enableSorting: true },
  {
    accessorKey: 'currentPrice',
    header: 'Current Price',
    cell: ({ row }) => formatCurrency(row.currentPrice),
    enableSorting: true,
  },
  {
    accessorKey: (row) => row.shares * row.currentPrice,
    header: 'Total Value',
    cell: ({ row }) => formatCurrency(row.shares * row.currentPrice),
    enableSorting: true,
  },
  {
    accessorKey: (row) => (row.shares * row.currentPrice) - (row.shares * row.avgPrice),
    header: 'P/L',
    cell: PnLCell,
    enableSorting: true,
  },
];
