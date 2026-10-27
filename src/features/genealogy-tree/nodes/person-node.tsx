"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { User, AlertCircle, CheckCircle2 } from "lucide-react";
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
        "w-60 rounded-xl bg-white border p-3 shadow-card transition-all duration-150 cursor-pointer relative group",
        data.is_focus
          ? "border-primary ring-2 ring-primary/30 shadow-md scale-102"
          : isMale
          ? "border-blue-200 hover:border-blue-400 hover:shadow-default"
          : "border-pink-200 hover:border-pink-400 hover:shadow-default"
      )}
    >
      {/* Top Handle for Parent connections */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-2.5 h-2.5 !bg-slate-400 border-2 border-white rounded-full"
      />

      <div className="flex items-center gap-3">
        {/* Avatar badge */}
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs shrink-0",
            isMale ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-pink-50 text-pink-700 border border-pink-200"
          )}
        >
          {initials}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-bold text-slate-900 truncate leading-tight">
            {data.primary_name}
          </h4>

          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            {data.birth_year ? data.birth_year : "??? "} –{" "}
            {data.is_living ? "Hidup" : data.death_year ? data.death_year : "Wafat"}
          </p>

          {data.nickname && (
            <span className="text-[10px] text-slate-400 italic block">
              &ldquo;{data.nickname}&rdquo;
            </span>
          )}
        </div>
      </div>

      {/* Badges footer */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
        {data.is_focus ? (
          <span className="px-2 py-0.5 rounded font-bold bg-primary text-white text-[10px]">
            Pusat Silsilah
          </span>
        ) : (
          <span className="text-slate-500 font-medium">
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
            <span title="Klaim terverifikasi" className="text-emerald-500 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>

      {/* Bottom Handle for Children / Unions */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2.5 h-2.5 !bg-slate-400 border-2 border-white rounded-full"
      />
    </div>
  );
});

PersonNode.displayName = "PersonNode";
