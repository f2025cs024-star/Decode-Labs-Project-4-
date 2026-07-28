import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ReactFlow, ReactFlowProvider, useReactFlow, Controls as FlowControls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import confetti from 'canvas-confetti';
import { Play, Pause, SkipForward, RotateCcw, AlertTriangle, CloudRain, ShieldAlert, Target } from 'lucide-react';
import { useDijkstra, INITIAL_NODES, ek } from '../hooks/useDijkstra';
import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';
import PathRider from './PathRider';

const nodeTypes = { custom: CustomNode };
const edgeTypes = { custom: CustomEdge };

const DashboardContent = () => {
  const {
    source,
    setSource,
    dest,
    setDest,
    edges,
    setEdges,
    frames,
    frameIdx,
    setFrameIdx,
    isPlaying,
    speed,
    setSpeed,
    play,
    stop,
    stepForward,
    resetSimulation,
    updateEdgeWeight,
    triggerChaosModifier,
    resetAllWeights,
    currentFrame,
  } = useDijkstra();

  const { getNodes, setNodes } = useReactFlow();

  const [guessMode, setGuessMode] = useState(false);
  const [guessAnswered, setGuessAnswered] = useState(false);
  const [guessFeedback, setGuessFeedback] = useState({ text: '', isCorrect: false });
  const [isShaking, setIsShaking] = useState(false);
  const [showFlare, setShowFlare] = useState(false);

  // Map of node IDs that belong to the active shortest path
  const [routeNodes, setRouteNodes] = useState(new Set());
  const [routeEdges, setRouteEdges] = useState(new Set());
  const [pathNodeIds, setPathNodeIds] = useState([]);

  // React Flow initial nodes
  const initialNodesList = useMemo(() => {
    return Object.entries(INITIAL_NODES).map(([id, n]) => ({
      id,
      type: 'custom',
      position: { x: n.x, y: n.y },
      data: {
        label: n.label,
        distance: Infinity,
        status: 'unvisited',
      },
    }));
  }, []);

  // Sync React Flow nodes positions and metadata with Dijkstra state
  useEffect(() => {
    setNodes((prevNodes) => {
      if (!prevNodes || prevNodes.length === 0) return initialNodesList;
      return prevNodes.map((n) => {
        let status = 'unvisited';
        if (currentFrame.current === n.id) status = 'active';
        else if (currentFrame.done[n.id]) status = 'finalized';
        if (routeNodes.has(n.id)) status = 'routed';

        return {
          ...n,
          data: {
            ...n.data,
            distance: currentFrame.dist[n.id] ?? Infinity,
            status,
          },
        };
      });
    });
  }, [currentFrame, routeNodes, setNodes, initialNodesList]);

  // Compute route when simulation completes and destination is selected
  useEffect(() => {
    if (!dest) {
      setRouteNodes(new Set());
      setRouteEdges(new Set());
      setPathNodeIds([]);
      return;
    }

    // Check if simulation is in 'done' frame
    const isDone = frameIdx === frames.length - 1;
    if (!isDone) {
      setRouteNodes(new Set());
      setRouteEdges(new Set());
      setPathNodeIds([]);
      return;
    }

    const prevMap = currentFrame.prev;
    const distMap = currentFrame.dist;

    if (!prevMap || distMap[dest] === undefined || distMap[dest] === Infinity) {
      setRouteNodes(new Set());
      setRouteEdges(new Set());
      setPathNodeIds([]);
      return;
    }

    const path = [];
    let cur = dest;
    const rNodes = new Set();
    while (cur) {
      path.unshift(cur);
      rNodes.add(cur);
      cur = prevMap[cur];
    }

    const rEdges = new Set();
    for (let i = 0; i < path.length - 1; i++) {
      rEdges.add(ek(path[i], path[i + 1]));
    }

    setRouteNodes(rNodes);
    setRouteEdges(rEdges);
    setPathNodeIds(path);

    if (distMap[dest] < 999) {
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#00f5d4', '#f97316'],
      });
    }
  }, [dest, frameIdx, frames.length, currentFrame]);

  // Toggles traffic on edge click
  const handleToggleTraffic = useCallback((edgeId) => {
    const edge = edges.find((e) => e.id === edgeId);
    if (!edge) return;
    const newWeight = edge.weight === edge.baseWeight ? edge.baseWeight + 10 : edge.baseWeight;
    updateEdgeWeight(edgeId, newWeight);

    // Briefly flash a subtle overlay indicator
    setShowFlare(true);
    setTimeout(() => setShowFlare(false), 300);
  }, [edges, updateEdgeWeight]);

  // Handle drag boundaries
  const onNodeDrag = useCallback((event, node) => {
    const w = 750; // Approximated map area width
    const h = 540; // Approximated map area height
    const padding = 30;

    let { x, y } = node.position;
    let clamped = false;

    if (x < padding) { x = padding; clamped = true; }
    if (x > w - 120 - padding) { x = w - 120 - padding; clamped = true; }
    if (y < padding) { y = padding; clamped = true; }
    if (y > h - 60 - padding) { y = h - 60 - padding; clamped = true; }

    if (clamped) {
      setNodes((nds) =>
        nds.map((n) => (n.id === node.id ? { ...n, position: { x, y } } : n))
      );
    }
  }, [setNodes]);

  // React Flow edges mapping
  const rfEdges = useMemo(() => {
    return edges.map((e) => {
      let status = 'unvisited';
      const edgeKey = ek(e.source, e.target);
      if (currentFrame.active?.has(edgeKey)) status = 'active';
      else if (currentFrame.tree?.has(edgeKey)) status = 'tree';
      if (routeEdges.has(edgeKey)) status = 'routed';

      return {
        id: e.id,
        type: 'custom',
        source: e.source,
        target: e.target,
        data: {
          weight: e.weight,
          baseWeight: e.baseWeight,
          status,
          onToggleTraffic: handleToggleTraffic,
        },
      };
    });
  }, [edges, currentFrame, routeEdges, handleToggleTraffic]);

  // Environmental chaos triggers
  const triggerChaos = (type) => {
    setIsShaking(true);
    setShowFlare(true);
    triggerChaosModifier(type);

    setTimeout(() => {
      setIsShaking(false);
      setShowFlare(false);
    }, 1000);
  };

  // Hard Reset Handler
  const handleHardReset = () => {
    resetSimulation();
    resetAllWeights();
    setRouteNodes(new Set());
    setRouteEdges(new Set());
    setPathNodeIds([]);
    setGuessAnswered(false);
    setGuessFeedback({ text: '', isCorrect: false });
  };

  // Guess next finalized node helper
  const handleGuess = (selectedNode) => {
    if (guessAnswered) return;
    setGuessAnswered(true);

    const correctNode = currentFrame.current;
    const lbl = (id) => INITIAL_NODES[id]?.label || id;

    if (selectedNode === correctNode) {
      setGuessFeedback({
        text: `✓ Correct! ${lbl(correctNode)} has the lowest metric (${currentFrame.dist[correctNode]}m).`,
        isCorrect: true,
      });
    } else {
      setGuessFeedback({
        text: `✗ Incorrect. ${lbl(correctNode)} is the optimal choice at ${currentFrame.dist[correctNode]}m.`,
        isCorrect: false,
      });
    }
  };

  // Re-build guess options
  const guessCandidates = useMemo(() => {
    if (currentFrame.type !== 'select') return [];
    const correct = currentFrame.current;
    // candidates are unvisited nodes, plus correct node
    const candidates = Object.keys(INITIAL_NODES).filter(
      (k) => !currentFrame.done[k] || k === correct
    );
    return candidates.sort(() => Math.random() - 0.5);
  }, [currentFrame]);

  // Clean log feed ticker with ticking execution timestamp signature
  const logItems = useMemo(() => {
    const items = [];
    for (let i = 0; i <= frameIdx; i++) {
      const f = frames[i];
      if (!f) continue;
      const timestamp = `[T-${String(i * 10).padStart(3, '0')}]`;
      items.push({
        id: i,
        timestamp,
        msg: f.msg,
        type: f.type,
      });
    }
    return items;
  }, [frames, frameIdx]);

  // Scroll log feed to bottom automatically
  useEffect(() => {
    const logBox = document.getElementById('log-feed');
    if (logBox) {
      logBox.scrollTop = logBox.scrollHeight;
    }
  }, [logItems]);

  // Trigger Guess Reset on frame change
  useEffect(() => {
    if (currentFrame.type !== 'select') {
      setGuessAnswered(false);
      setGuessFeedback({ text: '', isCorrect: false });
    }
  }, [currentFrame.type]);

  const showGuessPanel = guessMode && currentFrame.type === 'select';

  // Sort tactical table by distance
  const sortedTableRows = useMemo(() => {
    return Object.keys(INITIAL_NODES).sort((a, b) => {
      const distA = currentFrame.dist[a] === Infinity ? 1e9 : currentFrame.dist[a];
      const distB = currentFrame.dist[b] === Infinity ? 1e9 : currentFrame.dist[b];
      return distA - distB;
    });
  }, [currentFrame.dist]);

  const lbl = (id) => INITIAL_NODES[id]?.label || id;

  return (
    <div className={`wrap max-w-[1300px] mx-auto relative ${isShaking ? 'animate-shake' : ''}`}>
      {/* Flare Overlays */}
      {showFlare && (
        <div className="absolute inset-0 bg-red-600/10 pointer-events-none rounded-2xl border border-red-500/20 z-50 animate-pulse transition-all duration-300 backdrop-brightness-110" />
      )}

      <header className="text-center mb-8">
        <div className="text-sm font-black tracking-[4px] text-[#f97316] uppercase drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">
          Tactical Operations Command
        </div>
        <h1 className="font-extrabold text-4xl mt-2 mb-1.5 text-[#00f5d4] uppercase tracking-wider drop-shadow-[0_0_15px_rgba(0,245,212,0.4)]">
          Lahore Delivery Routing
        </h1>
        <p className="text-slate-400 text-sm font-semibold">
          Drag nodes to reposition · Click road labels for traffic injection · Smooth bezier routing
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Interactive Panel */}
        <div className="lg:col-span-7 space-y-5 bg-[#0f171e]/85 backdrop-blur-md border border-white/5 shadow-2xl rounded-2xl p-6">
          {/* Selectors */}
          <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
            <div className="flex flex-col">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Start (Depot)</label>
              <select
                value={source}
                onChange={(e) => {
                  stop();
                  setSource(e.target.value);
                  setDest('');
                }}
                className="font-bold text-sm bg-[#05070a] border border-white/10 rounded-lg px-3 py-2 text-[#00f5d4] outline-none cursor-pointer focus:border-[#00f5d4]"
              >
                {Object.keys(INITIAL_NODES).map((k) => (
                  <option key={k} value={k}>
                    {lbl(k)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Deliver to</label>
              <select
                value={dest}
                onChange={(e) => setDest(e.target.value)}
                className="font-bold text-sm bg-[#05070a] border border-white/10 rounded-lg px-3 py-2 text-[#00f5d4] outline-none cursor-pointer focus:border-[#00f5d4]"
              >
                <option value="">— none —</option>
                {Object.keys(INITIAL_NODES).map((k) => (
                  <option key={k} value={k}>
                    {lbl(k)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Map canvas */}
          <div className="relative border border-white/10 rounded-xl overflow-hidden bg-[#05070a] h-[540px]">
            <ReactFlow
              nodes={initialNodesList} // Initial layout mapping only, react hook syncs positions
              edges={rfEdges}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onNodeDrag={onNodeDrag}
              nodesConnectable={false}
              nodesDraggable={true}
              elementsSelectable={false}
              panOnDrag={false}
              zoomOnScroll={false}
              zoomOnDoubleClick={false}
              preventScrolling={true}
              // Set boundaries so nodes don't drift outside viewing panel
              translateExtent={[[-50, -50], [800, 600]]}
              nodeExtent={[[10, 10], [740, 500]]}
              fitView
              fitViewOptions={{ padding: 0.1 }}
            >
              <FlowControls showZoom={false} showInteractive={false} className="opacity-40" />
              <PathRider pathNodeIds={pathNodeIds} isVisible={frameIdx === frames.length - 1} />
            </ReactFlow>
          </div>

          {/* Legend */}
          <div className="flex gap-4 justify-center text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-700 border border-slate-500" />
              Unvisited
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#f97316] border border-orange-400 shadow-[0_0_8px_#f97316]" />
              Active Eval
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#00f5d4] border border-emerald-400 shadow-[0_0_8px_#00f5d4]" />
              Finalized
            </span>
          </div>

          {/* Playback Controls */}
          <div className="flex flex-wrap items-center gap-3 justify-center pt-2">
            <button
              onClick={isPlaying ? stop : play}
              className="flex items-center gap-2 px-4 py-2 font-bold text-xs uppercase tracking-wider rounded-lg border border-[#00f5d4] bg-[#00f5d4]/10 text-[#00f5d4] hover:bg-[#00f5d4] hover:text-black transition-all duration-300 shadow-[0_0_12px_rgba(0,245,212,0.15)] hover:shadow-[0_0_20px_#00f5d4]"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              {isPlaying ? 'Pause' : 'Play / Resume'}
            </button>
            <button
              onClick={stepForward}
              disabled={frameIdx >= frames.length - 1}
              className="flex items-center gap-2 px-4 py-2 font-bold text-xs uppercase tracking-wider rounded-lg border border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300"
            >
              <SkipForward size={14} />
              Step
            </button>
            <button
              onClick={handleHardReset}
              className="flex items-center gap-2 px-4 py-2 font-bold text-xs uppercase tracking-wider rounded-lg border border-red-500/30 bg-red-950/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              <RotateCcw size={14} />
              Hard Reset
            </button>
            <button
              onClick={() => setGuessMode(!guessMode)}
              className={`flex items-center gap-2 px-4 py-2 font-bold text-xs uppercase tracking-wider rounded-lg border transition-all duration-300 ${
                guessMode
                  ? 'border-[#00f5d4] text-[#00f5d4] bg-[#00f5d4]/10'
                  : 'border-slate-600 bg-slate-800 text-slate-400 hover:border-slate-500'
              }`}
            >
              <Target size={14} />
              Guess Mode
            </button>
            
            <div className="flex items-center gap-3 ml-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span>Speed</span>
              <input
                type="range"
                min="300"
                max="2000"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-24 accent-[#00f5d4] cursor-pointer h-1"
              />
            </div>
          </div>

          {/* Environmental Chaos Panel */}
          <div className="p-4 bg-red-600/5 border border-red-600/20 rounded-xl space-y-3">
            <h3 className="text-xs font-black text-red-300 uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle size={14} className="text-red-400" />
              Environmental Chaos Injection
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => triggerChaos('monsoon')}
                className="flex items-center gap-2 px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-wide rounded-lg border border-red-500/30 bg-red-950/20 text-red-300 hover:bg-red-600 hover:text-white transition-all duration-300"
              >
                <CloudRain size={13} />
                🌧️ Monsoon in Anarkali (+15m)
              </button>
              <button
                onClick={() => triggerChaos('vip')}
                className="flex items-center gap-2 px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-wide rounded-lg border border-red-500/30 bg-red-950/20 text-red-300 hover:bg-red-600 hover:text-white transition-all duration-300"
              >
                <ShieldAlert size={13} />
                🚨 VIP at Cantt (Blockade)
              </button>
            </div>
          </div>

          {/* Status Bar */}
          <div
            className={`text-center font-extrabold text-xs tracking-wider uppercase border rounded-xl py-3 px-4 transition-all duration-300 ${
              currentFrame.type === 'select'
                ? 'border-[#f97316]/30 bg-[#f97316]/5 text-[#f97316]'
                : currentFrame.type === 'done'
                ? 'border-[#00f5d4]/30 bg-[#00f5d4]/5 text-[#00f5d4]'
                : 'border-white/10 bg-white/5 text-slate-300'
            }`}
          >
            {currentFrame.msg}
          </div>

          {/* Guess Panel Mode */}
          {showGuessPanel && (
            <div className="p-4 bg-[#f97316]/5 border border-[#f97316]/20 rounded-xl space-y-3 animate-fade-in">
              <h3 className="text-xs font-black text-orange-300 uppercase tracking-widest">
                Target Prediction: Which node finals next?
              </h3>
              <div className="flex flex-wrap gap-2">
                {guessCandidates.map((k) => (
                  <button
                    key={k}
                    onClick={() => handleGuess(k)}
                    disabled={guessAnswered}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all duration-200 ${
                      guessAnswered
                        ? k === currentFrame.current
                          ? 'bg-teal-950/50 border-[#00f5d4] text-[#00f5d4]'
                          : 'bg-slate-900 border-slate-800 text-slate-600 opacity-60'
                        : 'bg-[#05070a] border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {lbl(k)}
                  </button>
                ))}
              </div>
              {guessAnswered && (
                <div
                  className={`text-xs font-extrabold transition-all duration-300 ${
                    guessFeedback.isCorrect ? 'text-[#00f5d4]' : 'text-red-300'
                  }`}
                >
                  {guessFeedback.text}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Info Panels */}
        <div className="lg:col-span-5 space-y-6">
          {/* Tactical Time Table */}
          <div className="bg-[#0f171e]/85 backdrop-blur-md border border-white/5 shadow-2xl rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 border-l-4 border-[#00f5d4] pl-2.5">
              Tactical Time Table
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-extrabold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Area</th>
                    <th className="py-2.5 px-3">Mins</th>
                    <th className="py-2.5 px-3">Via</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-semibold text-slate-300">
                  {sortedTableRows.map((k) => {
                    const isCurrent = currentFrame.current === k;
                    const isFinal = currentFrame.done[k];
                    const isRouted = routeNodes.has(k);

                    let rowClass = 'hover:bg-white/5';
                    if (isRouted) {
                      rowClass = 'bg-[#00f5d4]/10 text-teal-200';
                    } else if (isCurrent) {
                      rowClass = 'bg-[#f97316]/10 text-orange-200';
                    } else if (isFinal) {
                      rowClass = 'bg-[#00f5d4]/5 text-emerald-100';
                    }

                    const d = currentFrame.dist[k] === Infinity ? '∞' : `${currentFrame.dist[k]}m`;
                    const statusText = isCurrent ? 'EVALUATING' : isFinal ? 'LOCKED' : 'PENDING';

                    return (
                      <tr key={k} className={`transition-colors duration-200 ${rowClass}`}>
                        <td className="py-3 px-3 font-extrabold text-white">{lbl(k)}</td>
                        <td className="py-3 px-3 font-mono">{d}</td>
                        <td className="py-3 px-3">{currentFrame.prev[k] ? lbl(currentFrame.prev[k]) : '—'}</td>
                        <td className={`py-3 px-3 text-[10px] font-black tracking-wider ${isCurrent ? 'text-[#f97316]' : isFinal ? 'text-[#00f5d4]' : 'text-slate-500'}`}>
                          {statusText}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Route Bar */}
            <div className="mt-4 bg-[#00f5d4]/10 border-l-4 border-[#00f5d4] rounded-r-lg p-4 font-bold text-xs text-white">
              {dest ? (
                frameIdx === frames.length - 1 ? (
                  currentFrame.dist[dest] === Infinity ? (
                    <span>No path available to <b>{lbl(dest)}</b> due to blockades.</span>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <div className="text-[#00f5d4] font-black uppercase text-[10px] tracking-widest">Deployment Active</div>
                      <div>
                        🛵 <b>ROUTE:</b> <span className="text-[#00f5d4]">{currentFrame.dist[dest]} mins</span> ·{' '}
                        {pathNodeIds.map(lbl).join(' → ')}
                      </div>
                    </div>
                  )
                ) : (
                  <span>Execute simulation to reveal tactical route to <b>{lbl(dest)}</b>.</span>
                )
              ) : (
                <span className="text-slate-400">Awaiting deployment coordinates.</span>
              )}
            </div>
          </div>

          {/* Execution Log */}
          <div className="bg-[#0f171e]/85 backdrop-blur-md border border-white/5 shadow-2xl rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 border-l-4 border-[#00f5d4] pl-2.5">
              Execution Log
            </h2>
            <div
              id="log-feed"
              className="bg-[#05070a] border border-white/5 rounded-xl p-4 h-[240px] overflow-y-auto font-mono text-[11px] text-slate-400 space-y-2.5 scrollbar-thin scrollbar-thumb-white/10"
            >
              {logItems.length === 0 ? (
                <div className="text-center text-slate-600 py-8 italic">Telemetry system offline. Start simulation.</div>
              ) : (
                logItems.map((log) => {
                  let logColor = 'text-slate-400';
                  if (log.type === 'select') logColor = 'text-[#f97316] font-bold';
                  if (log.type === 'done' || log.type === 'final') logColor = 'text-[#00f5d4] font-bold';

                  return (
                    <div key={log.id} className="flex gap-2 items-start animate-fade-in border-b border-white/5 pb-1">
                      <span className="text-slate-600 select-none">{log.timestamp}</span>
                      <span className={logColor}>▸ {log.msg}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main wrapped export for React Flow Provider context
const Dashboard = () => {
  return (
    <ReactFlowProvider>
      <DashboardContent />
    </ReactFlowProvider>
  );
};

export default Dashboard;
