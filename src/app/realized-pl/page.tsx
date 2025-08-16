import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RealizedPL, Transaction } from '@/lib/types';

async function getRealizedPL(): Promise<RealizedPL[]> {
  const transactions = await api.getTransactions();
  const sellTransactions = transactions.filter((t) => t.type === 'Sell');
  
  const realizedPLData: RealizedPL[] = sellTransactions.map(sell => {
    const buyTransactions = transactions.filter(
        (t) => t.type === 'Buy' && t.assetName === sell.assetName
    );

    const totalBoughtQty = buyTransactions.reduce((acc, curr) => acc + curr.quantity, 0);
    const totalBoughtValue = buyTransactions.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const avgBuyPrice = totalBoughtQty > 0 ? totalBoughtValue / totalBoughtQty : 0;
    
    const costBasis = sell.quantity * avgBuyPrice;
    const saleValue = sell.totalAmount;
    const profitOrLoss = saleValue - costBasis;

    return {
        id: sell.id,
        saleDate: sell.date,
        assetName: sell.assetName,
        assetType: sell.assetType,
        quantitySold: sell.quantity,
        salePrice: sell.price,
        costBasis: costBasis,
        saleValue: saleValue,
        profitOrLoss: profitOrLoss,
    };
  });

  return realizedPLData;
}


export default async function RealizedPLPage() {
  const data = await getRealizedPL();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Realized Profit &amp; Loss</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} filterColumn="assetName" />
      </CardContent>
    </Card>
  );
}