import { createStore, createTypedHooks } from "easy-peasy";
import {
  TransactionsModel,
  transactionsModel,
} from "./models/transactions/transactions.model";
import { AuthModel, authModel } from "./models/authentication/auth.model";
import {
  TransactionFormModel,
  transactionFormModel,
} from "./models/transactionForm/transactionForm.model";

export interface StoreModel {
  transactions: TransactionsModel;
  transactionForm: TransactionFormModel;
  auth: AuthModel;
}

const storeModel: StoreModel = {
  transactions: transactionsModel,
  transactionForm: transactionFormModel,
  auth: authModel,
};

export const store = createStore(storeModel);

if (process.env.NODE_ENV === "development") {
  (window as any).store = store;
}

export const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
export const useStore = typedHooks.useStore;
