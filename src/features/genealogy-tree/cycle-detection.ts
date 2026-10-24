/**
 * Cycle Detection Engine — Pusaka Keluarga
 * Menjamin graf silsilah leluhur adalah Directed Acyclic Graph (DAG).
 */

export interface ParentChildEdge {
  parent_id: string;
  child_id: string;
}

/**
 * Memeriksa apakah menambahkan relasi parentId -> childId akan menimbulkan siklus dalam graf relasi yang ada.
 * @param existingEdges Daftar relasi parent-child yang sudah ada
 * @param parentId ID calon orang tua
 * @param childId ID calon anak
 * @returns true jika siklus terdeteksi, false jika aman
 */
export function detectCycleInTree(
  existingEdges: ParentChildEdge[],
  parentId: string,
  childId: string
): boolean {
  // 1. Seseorang tidak boleh menjadi orang tua dirinya sendiri
  if (parentId === childId) {
    return true;
  }

  // 2. Bangun adjacency list: child -> list of parents (untuk menelusuri leluhur ke atas)
  const childToParents = new Map<string, string[]>();
  for (const edge of existingEdges) {
    const parents = childToParents.get(edge.child_id) || [];
    parents.push(edge.parent_id);
    childToParents.set(edge.child_id, parents);
  }

  // Tambahkan relasi baru sementara jika belum ada
  // Kita ingin mencari: apakah childId sudah merupakan salah satu leluhur dari parentId?
  // Jika ya, maka menjadikan parentId sebagai orang tua dari childId akan menutup loop (siklus)!
  const visited = new Set<string>();
  const queue: string[] = [parentId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === childId) {
      return true; // Siklus ditemukan! childId adalah leluhur dari parentId
    }

    if (!visited.has(current)) {
      visited.add(current);
      const parents = childToParents.get(current) || [];
      for (const p of parents) {
        if (!visited.has(p)) {
          queue.push(p);
        }
      }
    }
  }

  return false;
}

/**
 * Menelusuri seluruh leluhur dari suatu individu dengan batasan kedalaman
 */
export function getAncestorsList(
  existingEdges: ParentChildEdge[],
  targetPersonId: string,
  maxDepth = 10
): Array<{ personId: string; depth: number }> {
  const childToParents = new Map<string, string[]>();
  for (const edge of existingEdges) {
    const parents = childToParents.get(edge.child_id) || [];
    parents.push(edge.parent_id);
    childToParents.set(edge.child_id, parents);
  }

  const results: Array<{ personId: string; depth: number }> = [];
  const visited = new Set<string>();
  const queue: Array<{ id: string; depth: number }> = [{ id: targetPersonId, depth: 0 }];

  while (queue.length > 0) {
    const { id, depth } = queue.shift()!;
    if (depth > 0 && !visited.has(id)) {
      visited.add(id);
      results.push({ personId: id, depth });
    }

    if (depth < maxDepth) {
      const parents = childToParents.get(id) || [];
      for (const p of parents) {
        if (!visited.has(p)) {
          queue.push({ id: p, depth: depth + 1 });
        }
      }
    }
  }

  return results;
}

/**
 * Menelusuri seluruh keturunan dari suatu individu dengan batasan kedalaman
 */
export function getDescendantsList(
  existingEdges: ParentChildEdge[],
  targetPersonId: string,
  maxDepth = 10
): Array<{ personId: string; depth: number }> {
  const parentToChildren = new Map<string, string[]>();
  for (const edge of existingEdges) {
    const children = parentToChildren.get(edge.parent_id) || [];
    children.push(edge.child_id);
    parentToChildren.set(edge.parent_id, children);
  }

  const results: Array<{ personId: string; depth: number }> = [];
  const visited = new Set<string>();
  const queue: Array<{ id: string; depth: number }> = [{ id: targetPersonId, depth: 0 }];

  while (queue.length > 0) {
    const { id, depth } = queue.shift()!;
    if (depth > 0 && !visited.has(id)) {
      visited.add(id);
      results.push({ personId: id, depth });
    }

    if (depth < maxDepth) {
      const children = parentToChildren.get(id) || [];
      for (const c of children) {
        if (!visited.has(c)) {
          queue.push({ id: c, depth: depth + 1 });
        }
      }
    }
  }

  return results;
}

