"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Panel,
} from "@xyflow/react";
import { PersonNode } from "./nodes/person-node";
import { UnionNode } from "./nodes/union-node";
import { buildTreeLayout, ViewMode, TreeDataPayload } from "./tree-layout";
import {
  Users,
  Compass,
  ArrowUp,
  ArrowDown,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  ExternalLink,
  GitFork,
} from "lucide-react";
import Link from "next/link";

const nodeTypes = {
  personNode: PersonNode,
  unionNode: UnionNode,
};

interface TreeContainerProps {
  initialData: TreeDataPayload;
}

export function TreeContainer({ initialData }: TreeContainerProps) {
  const [data, setData] = useState<TreeDataPayload>(initialData);
  const [viewMode, setViewMode] = useState<ViewMode>("hourglass");
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  const handleSelectPerson = useCallback((id: string) => {
    setSelectedPersonId(id);
  }, []);

  const handleSetFocus = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      focus_person_id: id,
    }));
    setSelectedPersonId(id);
  }, []);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    return buildTreeLayout(data, viewMode, handleSelectPerson);
  }, [data, viewMode, handleSelectPerson]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync state whenever data or viewMode changes
  useEffect(() => {
    const layout = buildTreeLayout(data, viewMode, handleSelectPerson);
    setNodes(layout.nodes);
    setEdges(layout.edges);
  }, [data, viewMode, handleSelectPerson, setNodes, setEdges]);

  const selectedPerson = useMemo(() => {
    if (!selectedPersonId) return null;
    return data.persons.find((p) => p.id === selectedPersonId) || null;
  }, [selectedPersonId, data.persons]);

  return (
    <div className="relative w-full h-[78vh] rounded-3xl border border-pusaka-200 bg-pusaka-50/40 overflow-hidden shadow-inner flex flex-col">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
        maxZoom={1.8}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#d2bab0" />
        <Controls className="!bg-white !border-pusaka-200 !shadow-sm !rounded-xl" />
        <MiniMap
          nodeColor={(n) => {
            if (n.data?.is_focus) return "#846358";
            return n.data?.gender === "male" ? "#93c5fd" : "#fbcfe8";
          }}
          className="!bg-white/90 !border-pusaka-200 !rounded-xl !shadow-sm hidden md:block"
        />

        {/* Floating Top Controls Panel */}
        <Panel position="top-left" className="!m-4 flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="bg-white/95 backdrop-blur p-1 rounded-2xl border border-pusaka-200 shadow-sm flex items-center space-x-1">
            <button
              onClick={() => setViewMode("ancestors")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                viewMode === "ancestors"
                  ? "bg-pusaka-800 text-white shadow-xs"
                  : "text-pusaka-700 hover:bg-pusaka-100"
              }`}
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Mode Leluhur</span>
            </button>

            <button
              onClick={() => setViewMode("descendants")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                viewMode === "descendants"
                  ? "bg-pusaka-800 text-white shadow-xs"
                  : "text-pusaka-700 hover:bg-pusaka-100"
              }`}
            >
              <ArrowDown className="w-3.5 h-3.5" />
              <span>Mode Keturunan</span>
            </button>

            <button
              onClick={() => setViewMode("hourglass")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                viewMode === "hourglass"
                  ? "bg-pusaka-800 text-white shadow-xs"
                  : "text-pusaka-700 hover:bg-pusaka-100"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Mode Gabungan</span>
            </button>
          </div>

          {/* Quick Focus Selector */}
          <div className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-2xl border border-pusaka-200 shadow-sm flex items-center space-x-2">
            <Compass className="w-3.5 h-3.5 text-pusaka-600" />
            <select
              value={data.focus_person_id}
              onChange={(e) => handleSetFocus(e.target.value)}
              className="text-xs bg-transparent text-pusaka-900 font-semibold focus:outline-none"
            >
              {data.persons.map((p) => (
                <option key={p.id} value={p.id}>
                  Fokus: {p.primary_name} ({p.birth_date_year || "???"})
                </option>
              ))}
            </select>
          </div>
        </Panel>
      </ReactFlow>

      {/* Selected Person Summary Drawer */}
      {selectedPerson && (
        <div className="absolute right-4 top-4 bottom-4 w-80 bg-white/95 backdrop-blur-md rounded-2xl border border-pusaka-200 shadow-xl p-5 z-30 flex flex-col justify-between animate-in fade-in slide-in-from-right-4 duration-200">
          <div>
            <div className="flex items-center justify-between border-b border-pusaka-100 pb-3 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-pusaka-500">
                Detail Individu
              </span>
              <button
                onClick={() => setSelectedPersonId(null)}
                className="w-6 h-6 rounded-full hover:bg-pusaka-100 flex items-center justify-center text-pusaka-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-3 mb-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base ${
                  selectedPerson.gender === "male"
                    ? "bg-blue-100 text-blue-900"
                    : "bg-rose-100 text-rose-900"
                }`}
              >
                {selectedPerson.primary_name
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-pusaka-900 leading-snug">
                  {selectedPerson.primary_name}
                </h3>
                {selectedPerson.nickname && (
                  <span className="text-xs text-pusaka-600">
                    &ldquo;{selectedPerson.nickname}&rdquo;
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 text-xs text-pusaka-700 bg-pusaka-50/60 p-3.5 rounded-xl border border-pusaka-100">
              <div className="flex justify-between">
                <span className="text-pusaka-500">Tahun Lahir:</span>
                <span className="font-semibold">{selectedPerson.birth_date_year || "Belum ada"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-pusaka-500">Status:</span>
                <span className="font-semibold">
                  {selectedPerson.is_living
                    ? "Masih Hidup"
                    : `Wafat (${selectedPerson.death_date_year || "Tahun tidak ada"})`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-pusaka-500">Jenis Kelamin:</span>
                <span className="font-semibold">
                  {selectedPerson.gender === "male" ? "Laki-laki" : "Perempuan"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-pusaka-100">
            {selectedPerson.id !== data.focus_person_id && (
              <button
                onClick={() => handleSetFocus(selectedPerson.id)}
                className="w-full py-2 px-3 rounded-xl bg-pusaka-100 hover:bg-pusaka-200 text-pusaka-900 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <GitFork className="w-3.5 h-3.5 text-pusaka-700" />
                <span>Jadikan Pusat Pohon</span>
              </button>
            )}

            <Link
              href={`/individu/${selectedPerson.id}`}
              className="w-full py-2 px-3 rounded-xl bg-pusaka-800 hover:bg-pusaka-900 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <span>Buka Profil Lengkap</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

