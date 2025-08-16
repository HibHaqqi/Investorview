'use client';

import type { UnrealizedPL } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const PnLCell = ({ row }: { row: UnrealizedPL }) => {
    const pnl = row.currentValue - row.investedValue;
    const pnlPercent = row.investedValue !== 0 ? (pnl / row.investedValue) * 100 : 0;
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
    accessorKey: keyof UnrealizedPL | ((row: UnrealizedPL) => any);
    header: any;
    cell?: ({ row }: { row: UnrealizedPL; }) => any;
    enableSorting?: boolean;
})[] = [
  { accessorKey: 'assetName', header: 'Asset Name', enableSorting: true },
  { 
    accessorKey: 'assetType', 
    header: 'Asset Type',
    cell: ({ row }) => <Badge variant="secondary">{row.assetType}</Badge>,
    enableSorting: true
  },
  { 
    accessorKey: 'investedValue', 
    header: 'Invested Value',
    cell: ({ row }) => formatCurrency(row.investedValue),
    enableSorting: true
  },
  { 
    accessorKey: 'currentValue', 
    header: 'Current Value',
    cell: ({ row }) => formatCurrency(row.currentValue),
    enableSorting: true
  },
  {
    accessorKey: (row) => row.currentValue - row.investedValue,
    header: 'Unrealized P/L',
    cell: PnLCell,
    enableSorting: true,
  },
];