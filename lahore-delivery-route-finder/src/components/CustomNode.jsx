import React from 'react';
import { Handle, Position } from '@xyflow/react';

const CustomNode = ({ data }) => {
  const { label, distance, status } = data;

  // Determine styles based on node status: 'unvisited', 'active', 'finalized', 'routed'
  let borderClass = 'border-slate-600 bg-slate-800 text-slate-300';
  let glowStyle = {};
  let iconColor = 'text-slate-400';
  let badgeStyle = 'bg-slate-700/80 text-slate-300 border-slate-600';

  if (status === 'active') {
    // Glowing Cyber-Amber
    borderClass = 'border-[#f97316] bg-[#f97316]/10 text-orange-200';
    glowStyle = {
      boxShadow: '0 0 20px rgba(249, 115, 22, 0.4), inset 0 0 10px rgba(249, 115, 22, 0.2)',
      textShadow: '0 0 8px rgba(249, 115, 22, 0.5)'
    };
    iconColor = 'text-[#f97316]';
    badgeStyle = 'bg-[#f97316]/20 text-[#f97316] border-[#f97316]/40';
  } else if (status === 'finalized' || status === 'routed') {
    // Glowing Electric Mint
    borderClass = 'border-[#00f5d4] bg-[#00f5d4]/10 text-emerald-100';
    glowStyle = {
      boxShadow: '0 0 20px rgba(0, 245, 212, 0.4), inset 0 0 10px rgba(0, 245, 212, 0.2)',
      textShadow: '0 0 8px rgba(0, 245, 212, 0.5)'
    };
    iconColor = 'text-[#00f5d4]';
    badgeStyle = 'bg-[#00f5d4]/20 text-[#00f5d4] border-[#00f5d4]/40';
  }

  const formattedDistance = distance === Infinity ? '∞' : `${distance}m`;

  return (
    <div
      style={glowStyle}
      className={`px-4 py-2.5 rounded-xl border-2 backdrop-blur-md transition-all duration-300 flex flex-col items-center justify-center min-w-[120px] select-none ${borderClass}`}
    >
      {/* Invisible Handles at Center to draw clean lines to node center */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0, pointerEvents: 'none' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0, pointerEvents: 'none' }}
      />

      {/* Industrial Hardware Core Aesthetic */}
      <div className="flex items-center gap-1.5 mb-1">
        <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-[#f97316] animate-ping' : status === 'finalized' || status === 'routed' ? 'bg-[#00f5d4]' : 'bg-slate-500'}`} />
        <span className="text-[10px] uppercase tracking-widest font-black opacity-50">Node Core</span>
      </div>

      <div className="font-extrabold text-sm tracking-wide text-center">{label}</div>

      <div className={`mt-1 text-[11px] font-mono px-2 py-0.5 rounded border ${badgeStyle}`}>
        [ {formattedDistance} ]
      </div>
    </div>
  );
};

export default React.memo(CustomNode);
