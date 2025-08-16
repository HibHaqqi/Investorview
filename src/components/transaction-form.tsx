'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { PlusCircle } from 'lucide-react';
import api from '@/lib/api';

const formSchema = z.object({
  assetName: z.string().min(2, { message: 'Asset name must be at least 2 characters.' }),
  assetType: z.enum(['Stock', 'Mutual Fund', 'Bond', 'Gold']),
  type: z.enum(['Buy', 'Sell']),
  quantity: z.coerce.number().positive(),
  price: z.coerce.number().positive(),
});

export function TransactionForm() {
    const router = useRouter();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            assetName: '',
            assetType: 'Stock',
            type: 'Buy',
            quantity: 0,
            price: 0,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await api.addTransaction({
                ...values,
                date: new Date().toISOString(),
                totalAmount: values.quantity * values.price,
            });
            toast({
                title: 'Transaction Added',
                description: `Successfully logged ${values.type} of ${values.assetName}.`,
            });
            form.reset();
            router.refresh();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to add transaction.',
            });
        }
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                    control={form.control}
                    name="assetName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Asset Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. Apple Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="assetType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Asset Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select asset type" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Stock">Stock</SelectItem>
                                <SelectItem value="Mutual Fund">Mutual Fund</SelectItem>
                                <SelectItem value="Bond">Bond</SelectItem>
                                <SelectItem value="Gold">Gold</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

             <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                 <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Transaction Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select transaction type" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Buy">Buy</SelectItem>
                                <SelectItem value="Sell">Sell</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Quantity / Units</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Price per Unit</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
             </div>
            <Button type="submit" disabled={form.formState.isSubmitting}>
                <PlusCircle className="mr-2 h-4 w-4" />
                {form.formState.isSubmitting ? 'Adding...' : 'Add Transaction'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
