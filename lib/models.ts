export type Domain = {
  id: string;
  name: string; // 健康/语言/社会/科学/艺术...
};

export type Indicator = {
  id: string;
  domainId: string;
  text: string;
  isSystem: boolean;
};

export type ChildProfile = {
  id: string;
  name: string;
  birthDate?: string; // YYYY-MM-DD
  className?: string;
  guardianName?: string;
  note?: string;
  createdAt: string; // ISO
};

export type MediaItem = {
  id: string;
  kind: "image" | "video" | "audio" | "file";
  name: string;
  size: number;
  lastModified: number;
};

export type Observation = {
  id: string;
  childId: string;
  occurredAt: string; // ISO
  domainId: string;
  indicatorIds: string[];
  note?: string;
  media: MediaItem[];
  sharedToFamily?: boolean;
  createdAt: string; // ISO
};

export type StoreSnapshot = {
  domains: Domain[];
  indicators: Indicator[];
  children: ChildProfile[];
  observations: Observation[];
};
