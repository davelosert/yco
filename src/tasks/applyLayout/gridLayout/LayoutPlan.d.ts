import { SpacePlan } from './SpacePlan';


type Unmanaged = 'ownSpace' | 'leave' | 'allInOne'
interface LayoutPlan {
  spaces: SpacePlan[];
  unmanaged: 
  commands: string[];
}
