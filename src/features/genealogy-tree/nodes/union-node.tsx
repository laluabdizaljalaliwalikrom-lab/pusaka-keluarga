"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Heart } from "lucide-react";

export interface UnionNodeData extends Record<string, unknown> {
  id: string;
  year?: number | null;
  status?: string;
}

export const UnionNode = memo(({ data }: { data: UnionNodeData }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Target handle from partner 1 */}
      <Handle
        type="target"
        position={Position.Left}
        id="partner-left"
        className="w-2.5 h-2.5 bg-rose-400 border border-white rounded-full"
      />

      <div className="w-8 h-8 rounded-full bg-rose-50 border-2 border-rose-300 shadow flex items-center justify-center text-rose-600">
        <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
      </div>

      {data.year && (
        <span className="text-[9px] font-bold text-pusaka-600 bg-white/90 px-1 rounded shadow-xs mt-0.5">
          {data.year}
        </span>
      )}

      {/* Target handle from partner 2 */}
      <Handle
        type="target"
        position={Position.Right}
        id="partner-right"
        className="w-2.5 h-2.5 bg-rose-400 border border-white rounded-full"
      />

      {/* Source handle towards biological children */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="children-out"
        className="w-2.5 h-2.5 bg-rose-600 border border-white rounded-full"
      />
    </div>
  );
});

UnionNode.displayName = "UnionNode";

