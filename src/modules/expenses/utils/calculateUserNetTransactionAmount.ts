import { TransactionType } from '../entities/expense-transaction.entity';
import { Expense } from '../entities/expense.entity';
import { calculateAmountsAfterAutoSplit } from './calculateAutoSplitAmounts';

export const calculateUserNetTransactionAmount = (
  expense?: Expense,
  userId?: string,
) => {
  if (!userId || !expense) return undefined;

  let paidAmount = 0;
  let receivedAmount = 0;

  const payerTransactions = expense.transactions.filter(
    (t) => t.type === TransactionType.PAYER,
  );
  const payeeTransactions = expense.transactions.filter(
    (t) => t.type === TransactionType.PAYEE,
  );

  if (payerTransactions) {
    const payerAutoSplitAmounts = calculateAmountsAfterAutoSplit(
      expense.amount,
      payerTransactions,
    );
    paidAmount =
      payerAutoSplitAmounts.find((i) => i.id === userId)?.amount ?? 0;
  }

  if (payeeTransactions) {
    const payeeAutoSplitAmounts = calculateAmountsAfterAutoSplit(
      expense.amount,
      payeeTransactions,
    );
    receivedAmount =
      payeeAutoSplitAmounts.find((i) => i.id === userId)?.amount ?? 0;
  }

  return {
    paidAmount,
    receivedAmount,
    netAmount: paidAmount - receivedAmount,
    currencyCode: expense.currencyCode,
  };
};
