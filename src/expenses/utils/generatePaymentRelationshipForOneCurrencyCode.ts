import { User } from '../../users/entities/user.entity';
import { TransactionType } from '../entities/expense-transaction.entity';
import { Expense } from '../entities/expense.entity';
import { calculateAmountsAfterAutoSplit } from './calculateAutoSplitAmounts';

// debtor give money to creditor for resolving the debt.
// In other words, payer paid money for payee -> payee need to pay back to payer -> payee is debtor and payer is creditor
export type PaymentRelationship = {
  debtor: User;
  creditor: User;
  debtAmount: number;
};

export const generatePaymentRelationshipForOneCurrencyCode = (
  expenses: Expense[],
  users: User[],
): PaymentRelationship[] => {
  if (users.length === 0) return [];

  const userById = Object.fromEntries(users.map((user) => [user.id, user]));

  const relationships: PaymentRelationship[] = [];

  expenses.forEach((expense) => {
    const payerTransactions = expense.transactions.filter(
      (t) => t.type === TransactionType.PAYER,
    );
    const payeeTransactions = expense.transactions.filter(
      (t) => t.type === TransactionType.PAYEE,
    );

    const payerAmounts = calculateAmountsAfterAutoSplit(
      expense.amount,
      payerTransactions,
    );
    const payeeAmounts = calculateAmountsAfterAutoSplit(
      expense.amount,
      payeeTransactions,
    );

    let payerIndex = 0;
    let receiverIndex = 0;

    while (receiverIndex < payeeAmounts.length) {
      const payer = payerAmounts[payerIndex];
      const payee = payeeAmounts[receiverIndex];

      if (!payer || !payee) break;

      // receiver need to paid back to payer
      const amountToPaid = Math.min(payee.amount, payer.amount);
      const isMoneyLeftInReceiver = payee.amount > payer.amount;

      if (payer.id !== payee.id) {
        const currentPaymentRelationship = relationships.find(
          (i) =>
            (i.debtor.id === payee.id && i.creditor.id === payer.id) ||
            (i.debtor.id === payer.id && i.creditor.id === payee.id),
        );

        if (currentPaymentRelationship) {
          currentPaymentRelationship.debtAmount +=
            currentPaymentRelationship.debtor.id === payee.id
              ? amountToPaid
              : -amountToPaid;

          // Reserve the payer and receiver
          if (currentPaymentRelationship.debtAmount < 0) {
            currentPaymentRelationship.debtor = userById[payee.id];
            currentPaymentRelationship.creditor = userById[payer.id];
            currentPaymentRelationship.debtAmount = Math.abs(
              currentPaymentRelationship.debtAmount,
            );
          }
        } else {
          relationships.push({
            debtor: userById[payee.id],
            creditor: userById[payer.id],
            debtAmount: payee.amount,
          });
        }
      }

      payer.amount -= amountToPaid;
      payee.amount -= amountToPaid;

      if (isMoneyLeftInReceiver) {
        payerIndex++;
      } else {
        receiverIndex++;
      }
    }
  });

  return relationships.filter((r) => r.debtAmount > 0.01);
};
