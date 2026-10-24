"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { User, AlertCircle, CheckCircle2, Heart, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PersonNodeData extends Record<string, unknown> {
  id: string;
  primary_name: string;
  nickname?: string | null;
  gender: string;
  is_living: boolean;
  birth_year?: number | null;
  death_year?: number | null;
  is_focus?: boolean;
  is_incomplete?: boolean;
  has_unverified_claim?: boolean;
  onSelectPerson?: (id: string) => void;
  onToggleExpand?: (id: string) => void;
  isExpanded?: boolean;
}

export const PersonNode = memo(({ data }: { data: PersonNodeData }) => {
  const isMale = data.gender === "male";
  const initials = data.primary_name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <div
      onClick={() => data.onSelectPerson && data.onSelectPerson(data.id)}
      className={cn(
        "w-60 rounded-2xl bg-white border-2 p-3 shadow-md transition-all cursor-pointer relative group",
        data.is_focus
          ? "border-pusaka-800 ring-4 ring-pusaka-800/20 shadow-lg scale-105"
          : isMale
          ? "border-blue-200 hover:border-blue-400"
          : "border-rose-200 hover:border-rose-400"
      )}
    >
      {/* Top Handle for Parent connections */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-pusaka-600 border-2 border-white rounded-full"
      />

      <div className="flex items-center space-x-3">
        {/* Avatar badge */}
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-inner",
            isMale ? "bg-blue-100 text-blue-900" : "bg-rose-100 text-rose-900"
          )}
        >
          {initials}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-1">
            <h4 className="text-xs font-bold text-pusaka-900 truncate leading-snug">
              {data.primary_name}
            </h4>
          </div>

          <p className="text-[11px] text-pusaka-600 font-medium mt-0.5">
            {data.birth_year ? data.birth_year : "??? "} –{" "}
            {data.is_living ? "Hidup" : data.death_year ? data.death_year : "Wafat"}
          </p>

          {data.nickname && (
            <span className="text-[10px] text-pusaka-500 italic block -mt-0.5">
              &ldquo;{data.nickname}&rdquo;
            </span>
          )}
        </div>
      </div>

      {/* Badges footer */}
      <div className="mt-2.5 pt-2 border-t border-pusaka-100 flex items-center justify-between text-[10px]">
        {data.is_focus ? (
          <span className="px-2 py-0.5 rounded-full bg-pusaka-800 text-white font-bold">
            Pusat Silsilah
          </span>
        ) : (
          <span className="text-pusaka-500 font-medium">
            {isMale ? "Laki-laki" : "Perempuan"}
          </span>
        )}

        <div className="flex items-center space-x-1">
          {data.is_incomplete && (
            <span
              title="Data kelahiran atau orang tua belum lengkap"
              className="text-amber-500 flex items-center"
            >
              <AlertCircle className="w-3.5 h-3.5" />
            </span>
          )}
          {!data.has_unverified_claim && (
            <span title="Terverifikasi bukti sumber" className="text-emerald-600 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>

      {/* Expand/Collapse Toggle Button */}
      {data.onToggleExpand && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            data.onToggleExpand!(data.id);
          }}
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border border-pusaka-300 shadow flex items-center justify-center text-pusaka-700 hover:bg-pusaka-100 hover:text-pusaka-900 transition-colors z-10"
        >
          {data.isExpanded ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </button>
      )}

      {/* Bottom Handle for Children connections */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-pusaka-600 border-2 border-white rounded-full"
      />
    </div>
  );
});

PersonNode.displayName = "PersonNode";

