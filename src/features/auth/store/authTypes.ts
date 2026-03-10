import { RequestState } from "@store/helpers";
import { User } from "@appTypes/index";

export interface AuthState extends RequestState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}
