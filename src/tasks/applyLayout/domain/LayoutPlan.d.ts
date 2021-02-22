import { SpaceIndex, SpacePlan } from './SpacePlan';


type LayoutPlan = SpacePlan[];

type addSpacesToDisplay = (display: number, spaces: Space[], layoutPlan: LayoutPlan) => LayoutPlan;
type getDestructionOffset = (display: number, layoutPlan: LayoutPlan) => number;
type getCreationOffset = (display: number, layoutPlan: LayoutPlan) => number;
type getHighestIndexForDisplay = (display: number, layoutPlan: LayoutPlan) => number;
type createLayoutPlan = (spaces: Space[]) => LayoutPlan;
type raiseIndexForDisplaysAfter = (display: number, offset: number, layoutPlan: LayoutPlan) => LayoutPlan;
type getSwapTarget = (sourceIndex: SpaceIndex, layoutPlan: LayoutPlan) => SpaceIndex | null;

export {
  addSpacesToDisplay,
  createLayoutPlan,
  LayoutPlan,
  getCreationOffset,
  getDestructionOffset,
  getHighestIndexForDisplay,
  getSwapTarget,
  raiseIndexForDisplaysAfter
}
