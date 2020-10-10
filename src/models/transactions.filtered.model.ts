import { computed, Computed } from "easy-peasy";
import { Transaction } from "../classes/Transaction";
import { MoneyAmount } from "../classes/MoneyAmount";
import { StoreModel } from "../store";
import { DateUtils } from "../utils/DateUtils/DateUtils";

export interface FilteredTransactionsModel {
  /**
   * All user's current transactions after filterign
   */
  items: Computed<FilteredTransactionsModel, Transaction[], StoreModel>;

  /**
   * Filtered transactions grouped and sorted by dates
   */
  itemsByDates: Computed<
    FilteredTransactionsModel,
    { date: Date; items: Transaction[] }[],
    StoreModel
  >;

  /**
   * Filtered amount of transactions
   */
  count: Computed<FilteredTransactionsModel, number, StoreModel>;

  /**
   * Sums of filtered transactions
   */
  sums: Computed<
    FilteredTransactionsModel,
    {
      all: MoneyAmount;
      expenses: MoneyAmount;
      incomes: MoneyAmount;
    },
    StoreModel
  >;
}

export const filteredTransactionsModel: FilteredTransactionsModel = {
  items: computed(
    [
      (_, storeState) => storeState.transactions.items,
      (_, storeState) => storeState.interval.startDate,
      (_, storeState) => storeState.interval.endDate,
      (_, storeState) => storeState.filters.searchTerm,
      (_, storeState) => storeState.filters.minAmount,
      (_, storeState) => storeState.filters.maxAmount,
      (_, storeState) => storeState.filters.categories,
    ],
    (
      items,
      startDate,
      endDate,
      searchTerm,
      minAmount,
      maxAmount,
      categories
    ) => {
      return items.filter((item) => {
        // Filter by start date
        if (DateUtils.compareDate(item.date, "<", startDate)) {
          return false;
        }

        // Filter by end date
        if (DateUtils.compareDate(item.date, ">", endDate)) {
          return false;
        }

        // Filter by minimum amount
        if (item.amount.value < minAmount) {
          return false;
        }

        // Filter by maximum amount
        if (item.amount.value > maxAmount) {
          return false;
        }

        // Filter by category (if categories filter activated)
        if (categories.length > 0 && !categories.includes(item.category)) {
          return false;
        }

        // Filter by search term
        if (
          !(
            item.amount.format().toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm) ||
            item.comment.toLowerCase().includes(searchTerm)
          )
        ) {
          return false;
        }

        // All filters passed: include
        return true;
      });
    }
  ),

  itemsByDates: computed(
    [(_, storeState) => storeState.transactions.filtered.items],
    (items) => {
      return DateUtils.groupByDate(items, (_) => _.date, { sort: true });
    }
  ),

  count: computed(
    [(_, storeState) => storeState.transactions.filtered.items],
    (items) => {
      return items.length;
    }
  ),

  sums: computed(
    [(_, storeState) => storeState.transactions.filtered.items],
    (items) => {
      const incomes = items
        .filter((_) => _.amount.isPositive)
        .reduce((sum, item) => sum + item.amount.value, 0);
      const expenses = items
        .filter((_) => _.amount.isNegative)
        .reduce((sum, item) => sum + item.amount.value, 0);
      return {
        all: new MoneyAmount(incomes + expenses),
        incomes: new MoneyAmount(incomes),
        expenses: new MoneyAmount(expenses),
      };
    }
  ),
};
