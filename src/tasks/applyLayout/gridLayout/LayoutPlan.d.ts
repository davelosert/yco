import { SpacePlan } from './SpacePlan';


type LayoutPlan = SpacePlan[];

type addSpaceToLayout = (space: Space, layoutPlan: LayoutPlan) => LayoutPlan;
type createLayoutPlan = () => LayoutPlan;


export {
  LayoutPlan,
  addSpaceToLayout,
  createLayoutPlan
}
