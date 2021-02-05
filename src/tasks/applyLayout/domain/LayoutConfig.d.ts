type Direction = 'vertical' | 'horizontal';
type WindowObject = Split | WindowDescriptor | string;

type WindowDescriptor = {
  app: string;
}

type Split = {
  split: Direction,
  windows: WindowObject[]
}

type SpaceConfig = WindowObject[];
type DisplayConfig = SpaceConfig[];

interface LayoutConfig {
  spaces: DisplayConfig[]
}
