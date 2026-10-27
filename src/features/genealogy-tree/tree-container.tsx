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
  X,
  ExternalLink,
  GitFork,
  Calendar,
  MapPin,
  ShieldCheck,
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
    <div className="relative w-full h-[76vh] rounded-xl border border-stroke bg-white overflow-hidden shadow-default flex flex-col">
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
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.2} color="#CBD5E1" />
        <Controls className="!bg-white !border-stroke !shadow-card !rounded-lg" />
        <MiniMap
          nodeColor={(n) => {
            if (n.data?.is_focus) return "#3C50E0";
            return n.data?.gender === "male" ? "#93C5FD" : "#FBCFE8";
          }}
          className="!bg-white/95 !border-stroke !rounded-lg !shadow-card hidden md:block"
        />

        {/* Floating Top Controls Panel (TailAdmin Segmented Bar) */}
        <Panel position="top-left" className="!m-4 flex flex-wrap items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="bg-white/95 backdrop-blur p-1 rounded-lg border border-stroke shadow-card flex items-center gap-1">
            <button
              onClick={() => setViewMode("ancestors")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === "ancestors"
                  ? "bg-primary text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Mode Leluhur</span>
            </button>

            <button
              onClick={() => setViewMode("descendants")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === "descendants"
                  ? "bg-primary text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <ArrowDown className="w-3.5 h-3.5" />
              <span>Mode Keturunan</span>
            </button>

            <button
              onClick={() => setViewMode("hourglass")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === "hourglass"
                  ? "bg-primary text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Mode Gabungan</span>
            </button>
          </div>

          {/* Quick Focus Selector */}
          <div className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg border border-stroke shadow-card flex items-center gap-2">
            <Compass className="w-4 h-4 text-primary" />
            <select
              value={data.focus_person_id}
              onChange={(e) => handleSetFocus(e.target.value)}
              className="text-xs bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
            >
              {data.persons.map((p) => (
                <option key={p.id} value={p.id}>
                  Pusat: {p.primary_name} ({p.birth_date_year || "???"})
                </option>
              ))}
            </select>
          </div>
        </Panel>
      </ReactFlow>

      {/* Selected Person Summary Drawer (TailAdmin Clean Drawer) */}
      {selectedPerson && (
        <div className="absolute right-4 top-4 bottom-4 w-80 md:w-96 bg-white/95 backdrop-blur-md rounded-xl border border-stroke shadow-dropdown p-5 z-30 flex flex-col justify-between animate-in fade-in slide-in-from-right-4 duration-200">
          <div>
            <div className="flex items-center justify-between border-b border-stroke pb-3 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Detail Profil Silsilah
              </span>
              <button
                onClick={() => setSelectedPersonId(null)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3.5 mb-5">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base shrink-0 border ${
                  selectedPerson.gender === "male"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-pink-50 text-pink-700 border-pink-200"
                }`}
              >
                {selectedPerson.primary_name
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-slate-900 leading-tight truncate">
                  {selectedPerson.primary_name}
                </h4>
                {selectedPerson.nickname && (
                  <p className="text-xs text-slate-500 font-medium">
                    &ldquo;{selectedPerson.nickname}&rdquo;
                  </p>
                )}
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                  {selectedPerson.gender === "male" ? "Laki-laki" : "Perempuan"} •{" "}
                  {selectedPerson.is_living ? "Masih Hidup" : "Telah Wafat"}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs border-t border-stroke pt-4">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 block text-[11px]">Rentang Masa Hidup</span>
                  <p className="font-semibold text-slate-800">
                    {selectedPerson.birth_date_year || "Tahun tidak tercatat"} –{" "}
                    {selectedPerson.is_living
                      ? "Sekarang (Masih Hidup)"
                      : selectedPerson.death_date_year || "Wafat"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 block text-[11px]">Status Validasi Dokumen</span>
                  <p className="font-semibold text-emerald-700">
                    Klaim Terverifikasi Resmi
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stroke space-y-2">
            <button
              onClick={() => handleSetFocus(selectedPerson.id)}
              className="w-full py-2.5 rounded-lg border border-stroke bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Compass className="w-4 h-4 text-primary" />
              <span>Jadikan Titik Pusat Silsilah</span>
            </button>

            <Link
              href={`/individu/${selectedPerson.id}`}
              className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Buka Profil Lengkap & Bukti</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
