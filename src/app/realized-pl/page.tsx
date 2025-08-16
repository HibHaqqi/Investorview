import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RealizedPL } from '@/lib/types';


async function getRealizedPLData(): Promise<RealizedPL[]> {
  const realizedPL = await api.getRealizedPL();
  return realizedPL;
}


export default async function RealizedPLPage() {
  const data = await getRealizedPLData();

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
