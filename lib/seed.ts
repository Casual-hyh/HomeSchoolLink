import { StoreSnapshot } from "./models";
import { getOrInitStore } from "./store";

export const seed: StoreSnapshot = {
  domains: [
    { id: "health", name: "健康" },
    { id: "language", name: "语言" },
    { id: "social", name: "社会" },
    { id: "science", name: "科学" },
    { id: "art", name: "艺术" },
  ],
  indicators: [
    // 健康
    { id: "h_1", domainId: "health", text: "能独立穿脱衣服", isSystem: true },
    { id: "h_2", domainId: "health", text: "能正确洗手并保持卫生习惯", isSystem: true },
    // 语言
    { id: "l_1", domainId: "language", text: "能用完整句表达需求与想法", isSystem: true },
    { id: "l_2", domainId: "language", text: "能倾听他人讲话并做出回应", isSystem: true },
    // 社会
    { id: "s_1", domainId: "social", text: "能与同伴合作游戏并遵守规则", isSystem: true },
    { id: "s_2", domainId: "social", text: "能在冲突中尝试沟通解决", isSystem: true },
    // 科学
    { id: "sc_1", domainId: "science", text: "能观察并描述常见现象", isSystem: true },
    { id: "sc_2", domainId: "science", text: "能进行简单分类与比较", isSystem: true },
    // 艺术
    { id: "a_1", domainId: "art", text: "能用多种材料进行表现与创作", isSystem: true },
    { id: "a_2", domainId: "art", text: "能感受音乐并做出节奏反应", isSystem: true },
  ],
  children: [],
  observations: [],
};

export function ensureSeed() {
  // 如果本地没有 store，就写入 seed；如果有，就不覆盖
  getOrInitStore(seed);
}
