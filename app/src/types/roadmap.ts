export type RoadmapItemType = 'Course' | 'Guide' | 'Path';

export type RoadmapLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type RoadmapItem = {
  type: RoadmapItemType;
  title: string;
  description: string;
  duration: string;
  level: RoadmapLevel;
};

export type RoadmapGroup = {
  id: string;
  label: string;
  description: string;
  items: RoadmapItem[];
};
