'use client';

import type { RealizedPL } from '@/lib/types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const PnLCell = ({ row }: { row: RealizedPL }) => {
    const pnl = row.profitOrLoss;
    const isPositive = pnl >= 0;

    return (
        <div className={`flex items-center font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUpRight className="mr-1 h-4 w-4" /> : <ArrowDownRight className="mr-1 h-4 w-4" />}
            {formatCurrency(pnl)}
        </div>
    );
};

export const columns: ({
    accessorKey: keyof RealizedPL | ((row: RealizedPL) => any);
    header: any;
    cell?: ({ row }: { row: RealizedPL; }) => any;
    enableSorting?: boolean;
})[] = [
  { 
    accessorKey: 'saleDate', 
    header: 'Sale Date',
    cell: ({ row }) => format(new Date(row.saleDate), 'MMM d, yyyy'),
    enableSorting: true
  },
  { accessorKey: 'assetName', header: 'Asset Name', enableSorting: true },
  { 
    accessorKey: 'assetType', 
    header: 'Asset Type',
    cell: ({ row }) => <Badge variant="secondary">{row.assetType}</Badge>,
    enableSorting: true
  },
  { accessorKey: 'quantitySold', header: 'Quantity Sold', enableSorting: true },
  { 
    accessorKey: 'salePrice', 
    header: 'Sale Price',
    cell: ({ row }) => formatCurrency(row.salePrice),
    enableSorting: true
  },
    { 
    accessorKey: 'costBasis', 
    header: 'Cost Basis',
    cell: ({ row }) => formatCurrency(row.costBasis),
    enableSorting: true
  },
    { 
    accessorKey: 'saleValue', 
    header: 'Sale Value',
    cell: ({ row }) => formatCurrency(row.saleValue),
    enableSorting: true
  },
  { 
    accessorKey: 'profitOrLoss', 
    header: 'Realized P/L',
    cell: PnLCell,
    enableSorting: true
  },
];