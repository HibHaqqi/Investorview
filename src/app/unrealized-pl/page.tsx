import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UnrealizedPL } from '@/lib/types';
import { DollarSign, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

async function getUnrealizedPL(): Promise<UnrealizedPL[]> {
    const [stocks, mutualFunds, bonds, gold] = await Promise.all([
        api.getCalculatedStocks(),
        api.getCalculatedMutualFunds(),
        api.getCalculatedBonds(),
        api.getCalculatedGold(),
    ]);

    const data: UnrealizedPL[] = [
        ...stocks.map(s => ({
            assetName: s.name,
            assetType: 'Stock' as const,
            investedValue: s.shares * s.avgPrice,
            currentValue: s.shares * s.currentPrice,
        })),
        ...mutualFunds.map(mf => ({
            assetName: mf.name,
            assetType: 'Mutual Fund' as const,
            investedValue: mf.investedValue,
            currentValue: mf.units * mf.nav,
        })),
        ...bonds.map(b => ({
            assetName: b.name,
            assetType: 'Bond' as const,
            investedValue: b.quantity * b.purchasePrice,
            currentValue: b.quantity * b.currentPrice,
        })),
        ...gold.map(g => ({
            assetName: g.name,
            assetType: 'Gold' as const,
            investedValue: g.grams * g.purchasePricePerGram,
            currentValue: g.grams * g.currentPricePerGram,
        })),
    ];
    return data;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);


export default async function UnrealizedPLPage() {
  const data = await getUnrealizedPL();

  const totalInvestedValue = data.reduce((acc, item) => acc + item.investedValue, 0);
  const totalCurrentValue = data.reduce((acc, item) => acc + item.currentValue, 0);
  const totalUnrealizedPL = totalCurrentValue - totalInvestedValue;

  const summaryCards = [
    {
      title: 'Total Invested Value',
      value: formatCurrency(totalInvestedValue),
      icon: DollarSign,
    },
    {
      title: 'Total Current Value',
      value: formatCurrency(totalCurrentValue),
      icon: TrendingUp,
    },
    {
      title: 'Total Unrealized P/L',
      value: formatCurrency(totalUnrealizedPL),
      icon: totalUnrealizedPL >= 0 ? ArrowUpRight : ArrowDownRight,
      color: totalUnrealizedPL >= 0 ? 'text-green-600' : 'text-red-600',
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
            <CardTitle>Unrealized Profit &amp; Loss</CardTitle>
        </CardHeader>
        <CardContent>
            <DataTable columns={columns} data={data} filterColumn="assetName" />
        </CardContent>
        </Card>
    </div>
  );
}
