import { describe, it, expect } from "vitest";
import {
  detectCycleInTree,
  getAncestorsList,
  getDescendantsList,
  type ParentChildEdge,
} from "./cycle-detection";

describe("Genealogy DAG & Cycle Detection", () => {
  it("rejects an individual being their own parent", () => {
    const isCycle = detectCycleInTree([], "person-1", "person-1");
    expect(isCycle).toBe(true);
  });

  it("detects direct cycle: A -> B, then B -> A", () => {
    const edges: ParentChildEdge[] = [{ parent_id: "A", child_id: "B" }];
    // Trying to make B parent of A
    const isCycle = detectCycleInTree(edges, "B", "A");
    expect(isCycle).toBe(true);
  });

  it("detects multi-generation ancestor cycle: A -> B -> C -> D, then D -> A", () => {
    const edges: ParentChildEdge[] = [
      { parent_id: "A", child_id: "B" },
      { parent_id: "B", child_id: "C" },
      { parent_id: "C", child_id: "D" },
    ];
    // Trying to make D parent of A (Grand-grandchild becoming ancestor of great-grandparent)
    const isCycle = detectCycleInTree(edges, "D", "A");
    expect(isCycle).toBe(true);
  });

  it("detects cycle across branching tree: E -> F -> C, and A -> B -> C, then C -> E", () => {
    const edges: ParentChildEdge[] = [
      { parent_id: "A", child_id: "B" },
      { parent_id: "B", child_id: "C" },
      { parent_id: "E", child_id: "F" },
      { parent_id: "F", child_id: "C" },
    ];
    // C is child of F, F is child of E. Making C parent of E should fail.
    const isCycle = detectCycleInTree(edges, "C", "E");
    expect(isCycle).toBe(true);
  });

  it("allows valid tree expansion: A -> B, then A -> C (siblings)", () => {
    const edges: ParentChildEdge[] = [{ parent_id: "A", child_id: "B" }];
    const isCycle = detectCycleInTree(edges, "A", "C");
    expect(isCycle).toBe(false);
  });

  it("allows valid multi-parent addition (father and mother sharing a child)", () => {
    const edges: ParentChildEdge[] = [
      { parent_id: "FATHER", child_id: "CHILD" },
    ];
    const isCycle = detectCycleInTree(edges, "MOTHER", "CHILD");
    expect(isCycle).toBe(false);
  });

  it("correctly traverses ancestors and respects depths", () => {
    const edges: ParentChildEdge[] = [
      { parent_id: "G1_Kakek", child_id: "G2_Ayah" },
      { parent_id: "G1_Nenek", child_id: "G2_Ayah" },
      { parent_id: "G2_Ayah", child_id: "G3_Saya" },
      { parent_id: "G2_Ibu", child_id: "G3_Saya" },
      { parent_id: "G3_Saya", child_id: "G4_Anak" },
    ];

    const ancestors = getAncestorsList(edges, "G4_Anak");
    expect(ancestors).toHaveLength(5);
    const depth1 = ancestors.filter((a) => a.depth === 1);
    expect(depth1.map((a) => a.personId)).toEqual(["G3_Saya"]);

    const depth2 = ancestors.filter((a) => a.depth === 2);
    expect(depth2.map((a) => a.personId).sort()).toEqual(["G2_Ayah", "G2_Ibu"].sort());

    const depth3 = ancestors.filter((a) => a.depth === 3);
    expect(depth3.map((a) => a.personId).sort()).toEqual(["G1_Kakek", "G1_Nenek"].sort());
  });

  it("correctly traverses descendants", () => {
    const edges: ParentChildEdge[] = [
      { parent_id: "G1_Kakek", child_id: "G2_Anak1" },
      { parent_id: "G1_Kakek", child_id: "G2_Anak2" },
      { parent_id: "G2_Anak1", child_id: "G3_Cucu1" },
      { parent_id: "G2_Anak2", child_id: "G3_Cucu2" },
    ];

    const descendants = getDescendantsList(edges, "G1_Kakek");
    expect(descendants).toHaveLength(4);
    const depth1 = descendants.filter((d) => d.depth === 1);
    expect(depth1.map((d) => d.personId).sort()).toEqual(["G2_Anak1", "G2_Anak2"].sort());

    const depth2 = descendants.filter((d) => d.depth === 2);
    expect(depth2.map((d) => d.personId).sort()).toEqual(["G3_Cucu1", "G3_Cucu2"].sort());
  });
});

