import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RealizedPL, Transaction } from '@/lib/types';

// This function calculates the cost basis using the FIFO (First-In, First-Out) method.
function calculateCostBasisFIFO(sellTransaction: Transaction, allTransactions: Transaction[]): number {
    const buyTransactions = allTransactions
        .filter(t => t.assetName === sellTransaction.assetName && t.type === 'Buy' && new Date(t.date) < new Date(sellTransaction.date))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let costBasis = 0;
    let quantityToSell = sellTransaction.quantity;

    for (const buy of buyTransactions) {
        if (quantityToSell <= 0) break;

        const qtyFromThisBuy = Math.min(buy.quantity, quantityToSell);
        costBasis += qtyFromThisBuy * buy.price;
        quantityToSell -= qtyFromThisBuy;
        // This is a simplification. A real FIFO implementation would need to track remaining quantities of each buy transaction.
        // For this mock, we assume buys are fully consumed before moving to the next.
    }
    
    // Fallback for cases where buy history might be incomplete in mock data
    if (quantityToSell > 0) {
        const avgBuyPrice = buyTransactions.length > 0
            ? buyTransactions.reduce((acc, t) => acc + t.totalAmount, 0) / buyTransactions.reduce((acc, t) => acc + t.quantity, 0)
            : 0;
        costBasis += quantityToSell * avgBuyPrice;
    }

    return costBasis;
}


async function getRealizedPL(): Promise<RealizedPL[]> {
  const transactions = await api.getTransactions();
  const sellTransactions = transactions.filter((t) => t.type === 'Sell');
  
  const realizedPLData: RealizedPL[] = sellTransactions.map(sell => {
    const costBasis = calculateCostBasisFIFO(sell, transactions);
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

  return realizedPLData.sort((a,b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime());
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
