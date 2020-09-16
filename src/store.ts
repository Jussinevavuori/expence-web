import { createStore, createTypedHooks } from "easy-peasy";
import { AuthModel, authModel } from "./models/authentication/auth.model";
import {
  TransactionsModel,
  transactionsModel,
} from "./models/transactions/transactions.model";
import { intervalModel, IntervalModel } from "./models/interval/interval.model";
import { FiltersModel, filtersModel } from "./models/filters/filters.model";

export interface StoreModel {
  transactions: TransactionsModel;
  interval: IntervalModel;
  filters: FiltersModel;
  auth: AuthModel;
}

const storeModel: StoreModel = {
  transactions: transactionsModel,
  interval: intervalModel,
  filters: filtersModel,
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
