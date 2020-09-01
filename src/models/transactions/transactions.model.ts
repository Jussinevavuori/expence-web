import {
  Action,
  action,
  Computed,
  computed,
  Thunk,
  thunk,
  ThunkOn,
  thunkOn,
} from "easy-peasy";
import { Transaction } from "./transactions.class";
import { JsonTransaction, isJsonTransactionArray } from "./transactions.json";
import { TransactionService } from "../../services/TransactionService";
import { isServerError, ServerError } from "../../utils/ServerError";
import { StoreModel } from "../../store";
import { compareDate } from "../../utils/compareDate";

const transactionService = new TransactionService();

export interface TransactionsModel {
  /**
   * Current transactions
   */
  items: Transaction[];

  /**
   * Current transactions, filtered
   */
  filteredItems: Computed<TransactionsModel, Transaction[], StoreModel>;

  /**
   * Current transactions grouped and sorted by dates
   */
  itemsByDates: Computed<
    TransactionsModel,
    { date: Date; items: Transaction[] }[]
  >;

  /**
   * Current filtered transactions grouped and sorted by dates
   */
  filteredItemsByDates: Computed<
    TransactionsModel,
    { date: Date; items: Transaction[] }[],
    StoreModel
  >;

  /**
   * Current amount of transactions
   */
  count: Computed<TransactionsModel, number>;

  /**
   * All different categories
   */
  categories: Computed<TransactionsModel, string[]>;

  /**
   * Fetch all transactions for user from server
   */
  getTransactions: Thunk<
    TransactionsModel,
    void,
    any,
    any,
    Promise<void | ServerError>
  >;
  _getTransactions: Action<TransactionsModel, JsonTransaction[]>;

  /**
   * Post and update transaction to state
   */
  postTransaction: Thunk<
    TransactionsModel,
    Omit<JsonTransaction, "id" | "uid">,
    any,
    any,
    Promise<void | ServerError>
  >;
  _postTransaction: Action<TransactionsModel, JsonTransaction>;

  /**
   * Delete and remove transaction from state
   */
  deleteTransaction: Thunk<
    TransactionsModel,
    string,
    any,
    any,
    Promise<void | ServerError>
  >;
  _deleteTransaction: Action<TransactionsModel, string>;

  /**
   * Put and update transaction to state
   */
  putTransaction: Thunk<
    TransactionsModel,
    JsonTransaction,
    any,
    any,
    Promise<void | ServerError>
  >;
  _putTransaction: Action<TransactionsModel, JsonTransaction>;

  /**
   * Patch and update transaction to state
   */
  patchTransaction: Thunk<
    TransactionsModel,
    JsonTransaction,
    any,
    any,
    Promise<void | ServerError>
  >;
  _patchTransaction: Action<TransactionsModel, JsonTransaction>;

  /**
   * Listening to auth changes
   */

  onAuthChanged: ThunkOn<TransactionsModel, any, StoreModel>;
  _clearTransactions: Action<TransactionsModel, void>;
}

export const transactionsModel: TransactionsModel = {
  items: [],

  filteredItems: computed(
    [
      (state) => state.items,
      (state, storeState) => storeState.transactionInterval.startDate,
      (state, storeState) => storeState.transactionInterval.endDate,
    ],
    (items, startDate, endDate) => {
      return items.filter((item) => {
        if (compareDate(item.date, "<", startDate)) return false;
        if (compareDate(item.date, ">", endDate)) return false;
        return true;
      });
    }
  ),

  itemsByDates: computed((state) => {
    return groupAndSortItemsByDates(state.items);
  }),

  filteredItemsByDates: computed((state) => {
    return groupAndSortItemsByDates(state.filteredItems);
  }),

  count: computed((state) => state.items.length),

  categories: computed((state) =>
    state.items.map((_) => _.category).filter((c, i, a) => a.indexOf(c) === i)
  ),

  /**
   * GET transactions Thunk and Action
   */
  getTransactions: thunk(async (actions) => {
    const { data } = await transactionService.getTransactions();
    if (isServerError(data)) {
      return data;
    } else if (isJsonTransactionArray(data)) {
      actions._getTransactions(data);
    }
  }),
  _getTransactions: action((state, jsons) => {
    state.items = jsons.map((json) => new Transaction(json));
  }),

  /**
   * POST transactions Thunk and Action
   */
  postTransaction: thunk(async (actions, json) => {
    const { data } = await transactionService.postTransaction(json);
    if (isServerError(data)) {
      return data;
    } else if (data) {
      actions._postTransaction(data);
    }
  }),

  _postTransaction: action((state, json) => {
    state.items.push(new Transaction(json));
  }),

  /**
   * DELETE transactions Thunk and Action
   */
  deleteTransaction: thunk(async (actions, id) => {
    const { data } = await transactionService.deleteTransaction(id);
    if (isServerError(data)) {
      return data;
    } else if (data) {
      actions._deleteTransaction(id);
    }
  }),

  _deleteTransaction: action((state, id) => {
    state.items = state.items.filter((item) => item.id !== id);
  }),

  /**
   * PUT transactions Thunk and Action
   */
  putTransaction: thunk(async (actions, json) => {
    const { data } = await transactionService.putTransaction(json);
    if (isServerError(data)) {
      return data;
    } else if (data) {
      actions._putTransaction(data);
    }
  }),
  _putTransaction: action((state, json) => {
    state.items = state.items.map((item) =>
      item.id === json.id ? new Transaction(json) : item
    );
  }),

  /**
   * PATCH transactions Thunk and Action
   */
  patchTransaction: thunk(async (actions, json) => {
    const { data } = await transactionService.putTransaction(json);
    if (isServerError(data)) {
      return data;
    } else if (data) {
      actions._patchTransaction(data);
    }
  }),
  _patchTransaction: action((state, json) => {
    state.items = state.items.map((item) =>
      item.id === json.id ? new Transaction(json) : item
    );
  }),

  onAuthChanged: thunkOn(
    (_, store) => [store.auth.logout, store.auth._login],
    (actions, target) => {
      const [loggedOut, loggedIn] = target.resolvedTargets;
      switch (target.type) {
        case loggedOut:
          actions._clearTransactions();
          break;
        case loggedIn:
          actions.getTransactions();
          break;
      }
    }
  ),
  _clearTransactions: action((state) => {
    state.items = [];
  }),
};

// Helper function to group and sort items by dates
function groupAndSortItemsByDates<T extends { date: Date }>(
  items: T[]
): { date: Date; items: T[] }[] {
  return Object.entries(
    items.reduce((result, transaction) => {
      const _datestring = transaction.date.toDateString();
      const _transactions = result[_datestring] ?? [];
      return { ...result, [_datestring]: [..._transactions, transaction] };
    }, {} as { [datestring: string]: T[] })
  )
    .map((entry) => {
      return {
        date: new Date(entry[0]),
        items: entry[1].sort((a, b) => b.date.getTime() - a.date.getTime()),
      };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}
