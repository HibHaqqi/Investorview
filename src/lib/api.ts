import { mockSummary, mockStocks, mockMutualFunds, mockBonds, mockGold, mockTransactions, mockPortfolioHistory, mockAssetAllocation } from './data';
import type { Stock, MutualFund, Bond, Gold, Transaction, PortfolioSummary, PortfolioHistory, AssetAllocation } from './types';

const api = {
  getSummary: async (): Promise<PortfolioSummary> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockSummary;
  },
  getStocks: async (): Promise<Stock[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockStocks;
  },
  getMutualFunds: async (): Promise<MutualFund[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockMutualFunds;
  },
  getBonds: async (): Promise<Bond[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockBonds;
  },
  getGold: async (): Promise<Gold[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockGold;
  },
  getTransactions: async (): Promise<Transaction[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockTransactions;
  },
  getPortfolioHistory: async (): Promise<PortfolioHistory[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPortfolioHistory;
  },
  getAssetAllocation: async (): Promise<AssetAllocation[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAssetAllocation;
  },
  addTransaction: async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTransaction = { ...transaction, id: String(mockTransactions.length + 1) };
    mockTransactions.unshift(newTransaction);
    return newTransaction;
  }
};

export default api;
