import { StoreSnapshot, ChildProfile, Observation, Indicator, Domain } from "./models";

const KEY = "hsl_store_v1";

function nowISO() {
  return new Date().toISOString();
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function safeParse(json: string | null) {
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function loadStore(): StoreSnapshot | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  return safeParse(raw) as StoreSnapshot | null;
}

export function saveStore(s: StoreSnapshot) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(s));
}

export function getOrInitStore(seed: StoreSnapshot): StoreSnapshot {
  const cur = loadStore();
  if (cur) return cur;
  saveStore(seed);
  return seed;
}

export function updateStore(mutator: (s: StoreSnapshot) => void, seed: StoreSnapshot) {
  const s = getOrInitStore(seed);
  mutator(s);
  saveStore(s);
  return s;
}

export function addChild(input: Omit<ChildProfile, "id" | "createdAt">, seed: StoreSnapshot) {
  return updateStore((s) => {
    const c: ChildProfile = { ...input, id: uid("child"), createdAt: nowISO() };
    s.children.unshift(c);
  }, seed);
}

export function deleteChild(childId: string, seed: StoreSnapshot) {
  return updateStore((s) => {
    s.children = s.children.filter((c) => c.id !== childId);
    s.observations = s.observations.filter((o) => o.childId !== childId);
  }, seed);
}

export function addObservation(input: Omit<Observation, "id" | "createdAt">, seed: StoreSnapshot) {
  return updateStore((s) => {
    const o: Observation = { ...input, id: uid("obs"), createdAt: nowISO() };
    s.observations.unshift(o);
  }, seed);
}

export function deleteObservation(obsId: string, seed: StoreSnapshot) {
  return updateStore((s) => {
    s.observations = s.observations.filter((o) => o.id !== obsId);
  }, seed);
}

export function addIndicator(input: Omit<Indicator, "id" | "isSystem">, seed: StoreSnapshot) {
  return updateStore((s) => {
    const it: Indicator = { ...input, id: uid("ind"), isSystem: false };
    s.indicators.unshift(it);
  }, seed);
}

export function deleteIndicator(indicatorId: string, seed: StoreSnapshot) {
  return updateStore((s) => {
    s.indicators = s.indicators.filter((i) => i.id !== indicatorId);
    // 同时清理引用（弱一致即可）
    s.observations = s.observations.map((o) => ({
      ...o,
      indicatorIds: o.indicatorIds.filter((id) => id !== indicatorId),
    }));
  }, seed);
}

export function getDomainName(domains: Domain[], id: string) {
  return domains.find((d) => d.id === id)?.name ?? "未知领域";
}

export function getIndicatorText(indicators: Indicator[], id: string) {
  return indicators.find((i) => i.id === id)?.text ?? "未知指标";
}
