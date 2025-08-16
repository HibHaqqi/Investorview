import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RealizedPL } from '@/lib/types';
import { DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

async function getRealizedPLData(): Promise<RealizedPL[]> {
  const realizedPL = await api.getRealizedPL();
  return realizedPL;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);


export default async function RealizedPLPage() {
  const data = await getRealizedPLData();

  const totalCostBasis = data.reduce((acc, item) => acc + item.costBasis, 0);
  const totalSaleValue = data.reduce((acc, item) => acc + item.saleValue, 0);
  const totalProfitOrLoss = data.reduce((acc, item) => acc + item.profitOrLoss, 0);

  const summaryCards = [
    {
      title: 'Total Cost Basis',
      value: formatCurrency(totalCostBasis),
      icon: DollarSign,
    },
    {
      title: 'Total Sale Value',
      value: formatCurrency(totalSaleValue),
      icon: DollarSign,
    },
    {
      title: 'Total Realized P/L',
      value: formatCurrency(totalProfitOrLoss),
      icon: totalProfitOrLoss >= 0 ? ArrowUpRight : ArrowDownRight,
      color: totalProfitOrLoss >= 0 ? 'text-green-600' : 'text-red-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summaryCards.map((card) => (
            <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <card.icon className={`h-4 w-4 text-muted-foreground ${card.color ?? ''}`} />
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${card.color ?? ''}`}>{card.value}</div>
            </CardContent>
            </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Realized Profit &amp; Loss History</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} filterColumn="assetName" />
        </CardContent>
      </Card>
    </div>
  );
}
