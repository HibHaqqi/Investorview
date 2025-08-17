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
import { useEffect, useState } from 'react';
import type { Stock, MutualFund, Bond, Gold } from '@/lib/types';

type OwnedAsset = {
    name: string;
    type: 'Stock' | 'Mutual Fund' | 'Bond' | 'Gold';
    quantity: number;
}

const formSchema = z.object({
  assetName: z.string().optional(),
  assetType: z.enum(['Stock', 'Mutual Fund', 'Bond', 'Gold']).optional(),
  type: z.enum(['Buy', 'Sell', 'Deposit', 'Withdrawal']),
  quantity: z.coerce.number().optional(),
  price: z.coerce.number().optional(),
  totalAmount: z.coerce.number().positive({message: 'Amount must be positive.'}),
}).refine(data => {
    if (data.type === 'Buy' || data.type === 'Sell') {
        return !!data.assetName && !!data.assetType && data.quantity! > 0 && data.price! > 0;
    }
    return true;
}, {
    message: "Asset details, quantity, and price are required for Buy/Sell.",
    path: ['assetName'], // you can choose a path to display the error
});

export function TransactionForm() {
    const router = useRouter();
    const { toast } = useToast();
    const [ownedAssets, setOwnedAssets] = useState<OwnedAsset[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            assetName: '',
            assetType: 'Stock',
            type: 'Buy',
            quantity: 0,
            price: 0,
            totalAmount: 0,
        },
    });

    const transactionType = form.watch('type');
    const selectedAssetName = form.watch('assetName');
    const quantity = form.watch('quantity');
    const price = form.watch('price');

    useEffect(() => {
        if(transactionType === 'Buy' || transactionType === 'Sell') {
            if (quantity && price) {
                form.setValue('totalAmount', quantity * price, { shouldValidate: true });
            }
        }
    }, [quantity, price, transactionType, form]);


    useEffect(() => {
        async function fetchOwnedAssets() {
            try {
                const [stocks, mutualFunds, bonds, gold] = await Promise.all([
                    api.getCalculatedStocks(),
                    api.getCalculatedMutualFunds(),
                    api.getCalculatedBonds(),
                    api.getCalculatedGold(),
                ]);
                const assetList: OwnedAsset[] = [
                    ...stocks.map(s => ({ name: s.name, type: 'Stock' as const, quantity: s.shares })),
                    ...mutualFunds.map(m => ({ name: m.name, type: 'Mutual Fund' as const, quantity: m.units })),
                    ...bonds.map(b => ({ name: b.name, type: 'Bond' as const, quantity: b.quantity })),
                    ...gold.map(g => ({ name: g.name, type: 'Gold' as const, quantity: g.grams })),
                ];
                setOwnedAssets(assetList.filter(a => a.quantity > 0));
            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to load owned assets.',
                });
            }
        }
        if (transactionType === 'Sell') {
            fetchOwnedAssets();
        }
    }, [transactionType, toast]);
    
    useEffect(() => {
        form.reset({
            assetName: '',
            assetType: 'Stock',
            type: transactionType,
            quantity: 0,
            price: 0,
            totalAmount: 0,
        });
    }, [transactionType, form]);

    useEffect(() => {
        if (transactionType === 'Sell') {
            const selectedAsset = ownedAssets.find(asset => asset.name === selectedAssetName);
            if (selectedAsset) {
                form.setValue('assetType', selectedAsset.type);
            }
        }
    }, [selectedAssetName, ownedAssets, form, transactionType]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (values.type === 'Sell') {
            const assetToSell = ownedAssets.find(a => a.name === values.assetName);
            if (!assetToSell || values.quantity! > assetToSell.quantity) {
                form.setError('quantity', {
                    type: 'manual',
                    message: `You can only sell up to ${assetToSell?.quantity || 0} units.`,
                });
                return;
            }
        }

        try {
            const payload: Omit<any, 'id'> = {
                date: new Date().toISOString(),
                type: values.type,
                totalAmount: values.totalAmount,
            };

            if (values.type === 'Buy' || values.type === 'Sell') {
                payload.assetName = values.assetName;
                payload.assetType = values.assetType;
                payload.quantity = values.quantity;
                payload.price = values.price;
            }

            await api.addTransaction(payload);
            toast({
                title: 'Transaction Added',
                description: `Successfully logged your ${values.type.toLowerCase()} transaction.`,
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

  const isCashTransaction = transactionType === 'Deposit' || transactionType === 'Withdrawal';


  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                            <SelectItem value="Deposit">Deposit</SelectItem>
                            <SelectItem value="Withdrawal">Withdrawal</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />

            {!isCashTransaction ? (
                <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="assetName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Asset Name</FormLabel>
                                {transactionType === 'Sell' ? (
                                    <Select onValueChange={field.onChange} value={field.value ?? ''}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select an asset to sell" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {ownedAssets.map(asset => (
                                                <SelectItem key={asset.name} value={asset.name}>{asset.name} ({asset.type})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <FormControl>
                                        <Input placeholder="e.g. Apple Inc." {...field} value={field.value ?? ''} />
                                    </FormControl>
                                )}
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
                            <Select onValueChange={field.onChange} value={field.value ?? 'Stock'} disabled={transactionType === 'Sell'}>
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
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Quantity / Units</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="0" {...field} value={field.value ?? 0} />
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
                                <Input type="number" placeholder="0.00" {...field} value={field.value ?? 0} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="totalAmount"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Total Amount</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="0.00" {...field} readOnly className="bg-muted" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                </>
            ) : (
                 <FormField
                    control={form.control}
                    name="totalAmount"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{transactionType === 'Deposit' ? 'Deposit Amount' : 'Withdrawal Amount'}</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            )}
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
