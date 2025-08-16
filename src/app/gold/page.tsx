import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import api from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Gold } from '@/lib/types';

async function getGold(): Promise<Gold[]> {
  const gold = await api.getCalculatedGold();
  return gold;
}

export default async function GoldPage() {
  const data = await getGold();

  return (
    <Card>
      <CardContent className="pt-6">
        <DataTable columns={columns} data={data} filterColumn="name" />
      </CardContent>
    </Card>
  );
}
