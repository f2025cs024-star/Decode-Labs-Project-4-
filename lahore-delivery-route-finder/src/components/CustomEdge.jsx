import React, { useMemo } from 'react';
import { getBezierPath, EdgeLabelRenderer } from '@xyflow/react';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data = {},
}) => {
  const { weight, baseWeight, status, onToggleTraffic } = data;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Calculate flow speed factor based on weight
  const animationDuration = useMemo(() => {
    if (weight >= 999) return '0s'; // blocked (no movement)
    if (weight > 25) return '8s';   // heavy traffic (creeping crawl)
    if (weight > 15) return '4s';   // medium traffic
    if (weight > 5) return '2s';    // normal flow
    return '0.8s';                  // clear fast road
  }, [weight]);

  const isTraffic = weight > baseWeight;
  const isBlocked = weight >= 999;

  // Determine edge color based on status and traffic
  const edgeColor = useMemo(() => {
    if (isBlocked) return '#b91c1c'; // Dark red for blockade
    if (isTraffic) return '#dc2626'; // Deep crimson for traffic
    if (status === 'routed') return '#00f5d4'; // Electric Mint
    if (status === 'tree') return '#00f5d4'; // Electric Mint
    if (status === 'active') return '#f97316'; // Cyber-Amber
    return '#334155'; // Unvisited slate-gray
  }, [status, isTraffic, isBlocked]);

  const pathStyle = useMemo(() => {
    const s = {
      stroke: edgeColor,
      strokeWidth: status === 'routed' ? 6 : status === 'active' ? 4 : 3,
      transition: 'stroke 0.3s, stroke-width 0.3s',
      ...style,
    };

    if (isBlocked) {
      s.strokeDasharray = '5 5';
      s.animation = 'none';
    } else if (status === 'active' || status === 'routed' || status === 'tree' || isTraffic) {
      s.strokeDasharray = '8 8';
      s.animation = `flow ${animationDuration} linear infinite`;
    }

    return s;
  }, [edgeColor, status, isTraffic, isBlocked, animationDuration, style]);

  // Handle click to toggle traffic
  const handleClick = (e) => {
    e.stopPropagation();
    if (onToggleTraffic) {
      onToggleTraffic(id);
    }
  };

  return (
    <>
      {/* Invisible thicker path for easy clicking */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={15}
        className="cursor-pointer"
        onClick={handleClick}
        pointerEvents="visibleStroke"
      />

      {/* Glow path effect for active/routed edges */}
      {(status === 'active' || status === 'routed') && (
        <path
          d={edgePath}
          fill="none"
          stroke={edgeColor}
          strokeWidth={status === 'routed' ? 12 : 8}
          style={{
            opacity: 0.15,
            filter: `blur(${status === 'routed' ? '4px' : '2px'})`,
            transition: 'stroke 0.3s, stroke-width 0.3s',
          }}
          pointerEvents="none"
        />
      )}

      {/* Primary visible path (optionally animated) */}
      <path
        id={id}
        d={edgePath}
        fill="none"
        style={pathStyle}
        markerEnd={markerEnd}
        pointerEvents="none"
      />

      {/* Interactive Badge Label */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan select-none"
        >
          <button
            onClick={handleClick}
            className={`
              flex items-center justify-center font-extrabold text-[11px] rounded-lg px-2 py-0.5 border transition-all duration-300
              ${
                isBlocked
                  ? 'bg-red-950/90 text-red-400 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                  : isTraffic
                  ? 'bg-rose-950/90 text-rose-200 border-red-500 shadow-[0_0_10px_rgba(220,38,38,0.4)] animate-pulse'
                  : status === 'active'
                  ? 'bg-orange-950/90 text-[#f97316] border-[#f97316] shadow-[0_0_8px_rgba(249,115,22,0.3)]'
                  : status === 'routed'
                  ? 'bg-teal-950/90 text-[#00f5d4] border-[#00f5d4] shadow-[0_0_8px_rgba(0,245,212,0.3)]'
                  : 'bg-[#05070a] text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200'
              }
            `}
          >
            {isBlocked ? 'BLOCK' : `${weight}m`}
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default React.memo(CustomEdge);
