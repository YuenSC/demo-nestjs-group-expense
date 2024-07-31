import { ExpenseTransaction } from '../entities/expense-transaction.entity';

export const calculateAmountsAfterAutoSplit = (
  amount: number,
  transactions: ExpenseTransaction[],
) => {
  const autoSplitCount = transactions.filter((i) => i.isAutoSplit).length;

  const amountPaid = transactions
    .filter((i) => !i.isAutoSplit)
    .reduce((prev, curr) => prev + (curr.amount as number), 0);

  const autoSplitAmount =
    autoSplitCount === 0
      ? 0
      : Math.max(0, (amount - amountPaid) / autoSplitCount);

  const actualAmountPerUser = transactions.map((i) => ({
    id: i.userId,
    amount: i.isAutoSplit ? autoSplitAmount : i.amount ?? 0,
  }));

  return actualAmountPerUser;
};
