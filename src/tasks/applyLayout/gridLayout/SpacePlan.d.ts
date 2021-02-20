import { Window, WindowTree } from "./WindowTree";

type Split = 'vertical' | 'horizontal';

type WindowId = number;
type Index: number;

type Action = 'create' | 'leave' | 'delete';

export interface SpacePlan {
  index: Index;
  display: number;
  windowTree: WindowTree;
  unmanagedWindows: Window[];
  unmanaged: boolean;
  swapWith: Index;
  action?: Action;
}
