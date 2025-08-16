import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/lib/types';
import { TransactionForm } from '@/components/transaction-form';

async function getTransactions(): Promise<Transaction[]> {
  const transactions = await api.getTransactions();
  return transactions;
}

export default async function TransactionsPage() {
  const data = await getTransactions();

  return (
    <div className="space-y-6">
      <TransactionForm />

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} filterColumn="assetName" />
        </CardContent>
      </Card>
    </div>
  );
}
