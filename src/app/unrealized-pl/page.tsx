import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UnrealizedPL } from '@/lib/types';

async function getUnrealizedPL(): Promise<UnrealizedPL[]> {
    const [stocks, mutualFunds, bonds, gold] = await Promise.all([
        api.getStocks(),
        api.getMutualFunds(),
        api.getBonds(),
        api.getGold(),
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

export default async function UnrealizedPLPage() {
  const data = await getUnrealizedPL();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unrealized Profit &amp; Loss</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} filterColumn="assetName" />
      </CardContent>
    </Card>
  );
}