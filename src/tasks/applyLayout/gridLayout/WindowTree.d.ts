export interface Window {
  id: number;
  display: number;
  space: number;
  frame: WindowSizes;
  type: 'window'
  app: 'string'
}

export interface SplitNode {
  split: 'vertical';
  windows: WindowObject[]
  type: 'treeNode'
}

type WindowObject = SplitNode | Window;

export type WindowTree = WindowObject;
