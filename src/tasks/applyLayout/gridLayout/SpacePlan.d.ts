import { WindowTree } from "./WindowTree";

type Split = 'vertical' | 'horizontal';

type WindowId = number;

type Action = 'create' | 'leave' | 'delete';

export interface SpacePlan {
  index: number;
  display: number;
  windowTree: WindowTree;
  action?: Action;
}
