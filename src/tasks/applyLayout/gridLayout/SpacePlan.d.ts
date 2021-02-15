import { WindowTree } from "./WindowTree";

type Split = 'vertical' | 'horizontal';

type WindowId = number;

type Action = 'create' | 'leave' | 'delete';

export interface SpacePlan {
  index: number;
  windowTree: WindowTree;
  first: WindowId;
  display: number;
  action: Action;
}
