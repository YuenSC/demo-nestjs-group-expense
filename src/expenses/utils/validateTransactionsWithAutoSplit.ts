import {
  ExpenseTransaction,
  TransactionType,
} from '../entities/expense-transaction.entity';

/**
 * Validates payer and payee transactions against the expected sum considering auto-split rules.
 * This function segregates payer and payee transactions and validates them separately.
 * If any transaction within the group is marked as auto-split, the total sum of that group's transactions
 * must not exceed the expected sum. Otherwise, the total sum must exactly match the expected sum.
 * @param expectedSum The expected sum to validate against.
 * @param transactions Array of ExpenseTransaction objects representing all transactions to be validated.
 * @returns True if both payer and payee transactions are valid according to the rules, false otherwise.
 */
export function validateTransactionsWithAutoSplit(
  expectedSum: number,
  transactions: ExpenseTransaction[],
): boolean {
  // Filter transactions into payers and payees
  const payerTransactions = transactions.filter(
    (t) => t.type === TransactionType.PAYER,
  );
  const payeeTransactions = transactions.filter(
    (t) => t.type === TransactionType.PAYEE,
  );

  // Validate both groups of transactions against the expected sum
  return (
    validateTransactions(expectedSum, payerTransactions) &&
    validateTransactions(expectedSum, payeeTransactions)
  );
}
/**
 * Validates a group of transactions (either payers or payees) against a total amount.
 * It ensures that:
 * 1. If any transaction in the group is marked as auto-split, the sum of the group's transactions
 *    must not exceed the total amount. Otherwise, the sum must exactly match the total amount.
 * 2. All userIds in the transactions are unique.
 * @param totalAmount The total amount expected from the sum of transactions.
 * @param transactions Array of ExpenseTransaction objects representing either payers or payees.
 * @returns True if the transactions are valid according to the rules (including unique userIds and
 *          correct sum with or without auto-split), false otherwise.
 */
function validateTransactions(
  totalAmount: number,
  transactions: ExpenseTransaction[],
): boolean {
  // Calculate the sum of transactions, considering auto-split rules
  const sum = calculateSum(transactions);

  // Check for unique userIds
  const userIds = new Set(transactions.map((t) => t.userId));
  const allUserIdsUnique = userIds.size === transactions.length;

  if (!allUserIdsUnique) {
    throw new Error('User Ids must be unique');
  }

  // Validate the sum against the total amount, considering auto-split rules
  const isValidSum = transactions.some((t) => t.isAutoSplit)
    ? sum <= totalAmount
    : sum === totalAmount;
  if (!isValidSum)
    throw new Error(
      'Invalid transactions. Please ensure the provided transactions can reconcile the total amount',
    );

  return true;
}

/**
 * Calculates the sum of a group of transactions, considering auto-split rules.
 * Transactions marked as auto-split are considered to have an amount of 0.
 * @param transactions Array of ExpenseTransaction objects representing either payers or payees.
 * @returns The calculated sum of the transactions.
 */
function calculateSum(transactions: ExpenseTransaction[]): number {
  return transactions.reduce((sum, transaction) => {
    // If isAutoSplit is true, the amount is considered as 0, otherwise use the actual amount.
    const transactionAmount = transaction.isAutoSplit
      ? 0
      : transaction.amount || 0;
    return sum + transactionAmount;
  }, 0);
}
