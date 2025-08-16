'use client';

import type { MutualFund } from '@/lib/types';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const PnLCell = ({ row }: { row: MutualFund }) => {
    const currentValue = row.units * row.nav;
    const pnl = currentValue - row.investedValue;
    const pnlPercent = (pnl / row.investedValue) * 100;
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
    accessorKey: keyof MutualFund | ((row: MutualFund) => any);
    header: any;
    cell?: ({ row }: { row: MutualFund; }) => any;
    enableSorting?: boolean;
})[] = [
  { accessorKey: 'name', header: 'Fund Name', enableSorting: true },
  { accessorKey: 'units', header: 'Units', enableSorting: true },
  { 
    accessorKey: 'nav', 
    header: 'NAV', 
    cell: ({ row }) => formatCurrency(row.nav), 
    enableSorting: true 
  },
  {
    accessorKey: (row) => row.units * row.nav,
    header: 'Current Value',
    cell: ({ row }) => formatCurrency(row.units * row.nav),
    enableSorting: true,
  },
  {
    accessorKey: (row) => (row.units * row.nav) - row.investedValue,
    header: 'P/L',
    cell: PnLCell,
    enableSorting: true,
  },
];
