import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import api from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { MutualFund } from '@/lib/types';

async function getMutualFunds(): Promise<MutualFund[]> {
  const funds = await api.getMutualFunds();
  return funds;
}

export default async function MutualFundsPage() {
  const data = await getMutualFunds();

  return (
    <Card>
      <CardContent className="pt-6">
        <DataTable columns={columns} data={data} filterColumn="name" />
      </CardContent>
    </Card>
  );
}
