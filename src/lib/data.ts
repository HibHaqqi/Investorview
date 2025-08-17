import type { Transaction } from './types';

// The single source of truth for all portfolio data is now the transaction history.
// Asset values and holdings will be calculated from this list.
export const mockTransactions: Transaction[] = [
  // Deposits & Withdrawals
  { id: 'd1', date: '2023-01-01', type: 'Deposit', totalAmount: 100000 },
  { id: 'd2', date: '2023-05-01', type: 'Deposit', totalAmount: 50000 },
  { id: 'w1', date: '2024-01-15', type: 'Withdrawal', totalAmount: 10000 },


  // Apple Inc.
  { id: '1', date: '2023-01-15', assetName: 'Apple Inc.', assetType: 'Stock', type: 'Buy', quantity: 20, price: 150.25, totalAmount: 3005 },
  { id: '2', date: '2023-03-10', assetName: 'Apple Inc.', assetType: 'Stock', type: 'Buy', quantity: 30, price: 160.50, totalAmount: 4815 },
  
  // Alphabet Inc. - Note: Price is high, assuming this might be pre-split or a different class.
  { id: '3', date: '2023-02-01', assetName: 'Alphabet Inc.', assetType: 'Stock', type: 'Buy', quantity: 5, price: 105.00, totalAmount: 525 },
  { id: '4', date: '2023-04-05', assetName: 'Alphabet Inc.', assetType: 'Stock', type: 'Buy', quantity: 5, price: 108.00, totalAmount: 540 },
  
  // Microsoft Corp.
  { id: '5', date: '2023-01-20', assetName: 'Microsoft Corp.', assetType: 'Stock', type: 'Buy', quantity: 30, price: 240.50, totalAmount: 7215 },
  { id: '13', date: '2024-05-10', assetName: 'Microsoft Corp.', assetType: 'Stock', type: 'Sell', quantity: 10, price: 415.00, totalAmount: 4150 },

  // Amazon.com, Inc.
  { id: '6', date: '2023-03-01', assetName: 'Amazon.com, Inc.', assetType: 'Stock', type: 'Buy', quantity: 15, price: 95.00, totalAmount: 1425 },

  // Tesla, Inc.
  { id: '7', date: '2023-04-10', assetName: 'Tesla, Inc.', assetType: 'Stock', type: 'Buy', quantity: 25, price: 185.80, totalAmount: 4645 },

  // Mutual Funds
  { id: '8', date: '2023-01-05', assetName: 'Fidelity 500 Index Fund', assetType: 'Mutual Fund', type: 'Buy', quantity: 50, price: 145.00, totalAmount: 7250 },
  { id: '9', date: '2023-02-15', assetName: 'Vanguard Total Stock Market Index Fund', assetType: 'Mutual Fund', type: 'Buy', quantity: 70, price: 220.00, totalAmount: 15400 },
  { id: '10', date: '2023-03-20', assetName: 'Schwab S&P 500 Index Fund', assetType: 'Mutual Fund', type: 'Buy', quantity: 100, price: 75.00, totalAmount: 7500 },

  // Bonds
  { id: '11', date: '2022-05-15', assetName: 'US Treasury Bond 5Y', assetType: 'Bond', type: 'Buy', quantity: 10, price: 995, totalAmount: 9950 },
  { id: '12', date: '2021-02-09', assetName: 'Corporate Bond XYZ', assetType: 'Bond', type: 'Buy', quantity: 5, price: 1050, totalAmount: 5250 },

  // Gold
  { id: '14', date: '2022-11-01', assetName: 'Digital Gold', assetType: 'Gold', type: 'Buy', quantity: 50, price: 65, totalAmount: 3250 },
  { id: '15', date: '2023-06-01', assetName: 'Gold Sovereign Bonds', assetType: 'Gold', type: 'Buy', quantity: 100, price: 60, totalAmount: 6000 },
  { id: '16', date: '2024-04-01', assetName: 'Digital Gold', assetType: 'Gold', type: 'Sell', quantity: 20, price: 75, totalAmount: 1500 },

];
