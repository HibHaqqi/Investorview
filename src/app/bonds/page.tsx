import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import api from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Bond } from '@/lib/types';

async function getBonds(): Promise<Bond[]> {
  const bonds = await api.getBonds();
  return bonds;
}

export default async function BondsPage() {
  const data = await getBonds();

  return (
    <Card>
      <CardContent className="pt-6">
        <DataTable columns={columns} data={data} filterColumn="name" />
      </CardContent>
    </Card>
  );
}
