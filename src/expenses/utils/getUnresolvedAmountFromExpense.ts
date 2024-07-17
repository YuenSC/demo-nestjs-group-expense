import {
  ExpenseTransaction,
  TransactionType,
} from '../entities/expense-transaction.entity';
import { Expense } from '../entities/expense.entity';

export const getUnresolvedAmountFromExpense = (
  expense: Expense,
  userId: string,
) => {
  const { transactions } = expense;

  let numberOfAutoSplitPayer = 0;
  let numberOfAutoSplitPayee = 0;
  let myPayerTransaction: ExpenseTransaction | undefined;
  let myPayeeTransaction: ExpenseTransaction | undefined;

  // Iterate through transactions once to gather all necessary information
  transactions.forEach((t) => {
    if (t.type === TransactionType.PAYER && t.isAutoSplit) {
      numberOfAutoSplitPayer++;
    }
    if (t.type === TransactionType.PAYEE && t.isAutoSplit) {
      numberOfAutoSplitPayee++;
    }
    if (t.userId === userId) {
      if (t.type === TransactionType.PAYER) {
        myPayerTransaction = t;
      } else if (t.type === TransactionType.PAYEE) {
        myPayeeTransaction = t;
      }
    }
  });

  // If the user has no transactions, return 0
  if (!myPayerTransaction && !myPayeeTransaction) return 0;

  const amountPaid = getAmount(
    expense.amount,
    numberOfAutoSplitPayer,
    myPayerTransaction,
  );
  const amountOwed = getAmount(
    expense.amount,
    numberOfAutoSplitPayee,
    myPayeeTransaction,
  );

  return amountPaid - amountOwed;
};

const getAmount = (
  totalAmount: number,
  numberOfAutoSplitUser: number,
  transaction?: ExpenseTransaction,
) => {
  if (!transaction) return 0;
  if (!transaction.isAutoSplit) return transaction.amount;
  if (numberOfAutoSplitUser === 0) return 0;

  return totalAmount / numberOfAutoSplitUser;
};
