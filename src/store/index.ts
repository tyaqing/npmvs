import { defineStore } from "pinia";

interface IUserState {
  selectedPkg: string[];
}

export const useGlobalStore = defineStore("global", {
  state: (): IUserState => {
    return { selectedPkg: [] };
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    // increment() {},
  },
});
