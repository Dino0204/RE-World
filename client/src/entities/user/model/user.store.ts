import { create } from "zustand";

interface UserState {
  id: string | null;
  name: string | null;
  email: string | null;
  picture: string | null;
}

interface UserActions {
  setUser: (user: Pick<UserState, "id" | "name" | "email" | "picture">) => void;
  reset: () => void;
}

const initialState: UserState = {
  id: null,
  name: null,
  email: null,
  picture: null,
};

export const useUserStore = create<UserState & UserActions>()((set) => ({
  ...initialState,
  setUser: (user) => set(user),
  reset: () => set(initialState),
}));
