import { SpacePlan } from './SpacePlan';


type Unmanaged = 'ownSpace' | 'leave' | 'allInOne'
type LayoutPlan {
  spaces: SpacePlan[];
}
