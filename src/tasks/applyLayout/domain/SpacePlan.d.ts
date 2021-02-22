import { Window, WindowTree } from "./WindowTree";

type SpaceIndex = number;

type Action = 'create' | 'leave' | 'delete';

interface SpacePlan {
  index: SpaceIndex;
  display: number;
  windowTree?: WindowTree;
  unmanagedWindows?: Window[];
  unmanaged?: boolean;
  swapWith?: SpaceIndex;
  action?: Action;
}

export {
  SpacePlan,
  SpaceIndex,
}
