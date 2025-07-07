import { TOptionsActions } from "./optionsAction";
import { TResultOfSelectedOptionActions } from "./resultOfSelectedOptionsActions";

export type TApplicationActions = 
  | TOptionsActions
  | TResultOfSelectedOptionActions;
