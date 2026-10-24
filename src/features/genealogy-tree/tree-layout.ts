import { Node, Edge } from "@xyflow/react";
import { PersonNodeData } from "./nodes/person-node";
import { UnionNodeData } from "./nodes/union-node";

export type ViewMode = "ancestors" | "descendants" | "hourglass";

export interface TreeDataPayload {
  focus_person_id: string;
  persons: Array<{
    id: string;
    primary_name: string;
    nickname?: string | null;
    gender: string;
    is_living: boolean;
    birth_date_year?: number | null;
    death_date_year?: number | null;
    is_private?: boolean;
    generation_level?: number;
  }>;
  relationships: Array<{
    id: string;
    parent_id: string;
    child_id: string;
    relationship_type?: string;
    confidence?: string;
  }>;
  unions: Array<{
    id: string;
    start_date_year?: number | null;
    status?: string;
    participants: Array<{
      person_id: string;
      role: string;
    }>;
  }>;
}

const NODE_WIDTH = 260;
const NODE_HEIGHT = 100;
const HORIZONTAL_SPACING = 60;
const VERTICAL_SPACING = 140;

export function buildTreeLayout(
  data: TreeDataPayload,
  mode: ViewMode = "hourglass",
  onSelectPerson?: (id: string) => void,
  onToggleExpand?: (id: string) => void
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const focusId = data.focus_person_id;
  const personMap = new Map(data.persons.map((p) => [p.id, p]));

  // 1. Hitung level generasi relatif terhadap focusId (Focus = Level 0)
  const levels = new Map<string, number>();
  levels.set(focusId, 0);

  // Telusuri leluhur (level -1, -2, ...)
  const childToParents = new Map<string, string[]>();
  const parentToChildren = new Map<string, string[]>();

  for (const rel of data.relationships) {
    const parents = childToParents.get(rel.child_id) || [];
    parents.push(rel.parent_id);
    childToParents.set(rel.child_id, parents);

    const children = parentToChildren.get(rel.parent_id) || [];
    children.push(rel.child_id);
    parentToChildren.set(rel.parent_id, children);
  }

  // BFS ke atas untuk leluhur (level negatif)
  const ancestorQueue: Array<{ id: string; level: number }> = [{ id: focusId, level: 0 }];
  const visitedAncestors = new Set<string>([focusId]);

  while (ancestorQueue.length > 0) {
    const { id, level } = ancestorQueue.shift()!;
    levels.set(id, level);

    const parents = childToParents.get(id) || [];
    for (const p of parents) {
      if (!visitedAncestors.has(p)) {
        visitedAncestors.add(p);
        ancestorQueue.push({ id: p, level: level - 1 });
      }
    }
  }

  // BFS ke bawah untuk keturunan (level positif)
  const descendantQueue: Array<{ id: string; level: number }> = [{ id: focusId, level: 0 }];
  const visitedDescendants = new Set<string>([focusId]);

  while (descendantQueue.length > 0) {
    const { id, level } = descendantQueue.shift()!;
    levels.set(id, level);

    const children = parentToChildren.get(id) || [];
    for (const c of children) {
      if (!visitedDescendants.has(c)) {
        visitedDescendants.add(c);
        descendantQueue.push({ id: c, level: level + 1 });
      }
    }
  }

  // Pasangan mendapatkan level yang sama dengan pasangannya
  for (const u of data.unions) {
    const pIds = u.participants.map((up) => up.person_id);
    let commonLevel: number | null = null;
    for (const pid of pIds) {
      if (levels.has(pid)) {
        commonLevel = levels.get(pid)!;
        break;
      }
    }
    if (commonLevel !== null) {
      for (const pid of pIds) {
        if (!levels.has(pid)) {
          levels.set(pid, commonLevel);
        }
      }
    }
  }

  // Filter person berdasarkan ViewMode:
  // - "ancestors": hanya level <= 0
  // - "descendants": hanya level >= 0
  // - "hourglass": semua level
  const filteredPersonIds = Array.from(levels.keys()).filter((pid) => {
    const lvl = levels.get(pid) || 0;
    if (mode === "ancestors") return lvl <= 0;
    if (mode === "descendants") return lvl >= 0;
    return true;
  });

  // Kelompokkan person berdasarkan level untuk penempatan horizontal
  const levelGroups = new Map<number, string[]>();
  for (const pid of filteredPersonIds) {
    const lvl = levels.get(pid) || 0;
    const group = levelGroups.get(lvl) || [];
    group.push(pid);
    levelGroups.set(lvl, group);
  }

  // 2. Tentukan posisi (X, Y) tiap nodus
  levelGroups.forEach((personIds, level) => {
    const totalWidth = personIds.length * (NODE_WIDTH + HORIZONTAL_SPACING) - HORIZONTAL_SPACING;
    const startX = -totalWidth / 2;
    const posY = level * VERTICAL_SPACING;

    personIds.forEach((pid, index) => {
      const person = personMap.get(pid);
      if (!person) return;

      const posX = startX + index * (NODE_WIDTH + HORIZONTAL_SPACING);

      nodes.push({
        id: `person-${person.id}`,
        type: "personNode",
        position: { x: posX, y: posY },
        data: {
          id: person.id,
          primary_name: person.primary_name,
          nickname: person.nickname,
          gender: person.gender,
          is_living: person.is_living,
          birth_year: person.birth_date_year,
          death_year: person.death_date_year,
          is_focus: person.id === focusId,
          is_incomplete: !person.birth_date_year,
          has_unverified_claim: false,
          onSelectPerson,
          onToggleExpand,
          isExpanded: true,
        } as PersonNodeData,
      });
    });
  });

  // 3. Bangun Edges Relasi Orang Tua -> Anak
  for (const rel of data.relationships) {
    if (filteredPersonIds.includes(rel.parent_id) && filteredPersonIds.includes(rel.child_id)) {
      edges.push({
        id: `edge-${rel.parent_id}-${rel.child_id}`,
        source: `person-${rel.parent_id}`,
        target: `person-${rel.child_id}`,
        type: "smoothstep",
        animated: rel.relationship_type === "adopted",
        style: {
          stroke: rel.confidence === "verified" ? "#64748b" : "#f59e0b",
          strokeWidth: 2,
        },
      });
    }
  }

  return { nodes, edges };
}

