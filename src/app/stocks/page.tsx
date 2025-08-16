import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import api from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Stock } from '@/lib/types';

async function getStocks(): Promise<Stock[]> {
  const stocks = await api.getCalculatedStocks();
  return stocks;
}

export default async function StocksPage() {
  const data = await getStocks();

  return (
    <Card>
      <CardContent className="pt-6">
        <DataTable columns={columns} data={data} filterColumn="name" />
      </CardContent>
    </Card>
  );
}
