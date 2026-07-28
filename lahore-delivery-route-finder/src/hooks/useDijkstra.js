import { useState, useEffect, useRef, useCallback } from 'react';

export const INITIAL_NODES = {
  Anarkali: { x: 400, y: 80, label: "Anarkali" },
  Cantt: { x: 650, y: 200, label: "Cantt" },
  Liberty: { x: 480, y: 280, label: "Liberty" },
  Gulberg: { x: 400, y: 260, label: "Gulberg" },
  Iqbal: { x: 150, y: 250, label: "Iqbal Town" },
  DHA: { x: 600, y: 450, label: "DHA" },
  ModelTown: { x: 350, y: 400, label: "Model Town" },
  JoharTown: { x: 200, y: 450, label: "Johar Town" },
};

export const INITIAL_EDGES = [
  { id: "Gulberg-Liberty", source: "Gulberg", target: "Liberty", baseWeight: 5, weight: 5 },
  { id: "Gulberg-Cantt", source: "Gulberg", target: "Cantt", baseWeight: 15, weight: 15 },
  { id: "Gulberg-Anarkali", source: "Gulberg", target: "Anarkali", baseWeight: 20, weight: 20 },
  { id: "Gulberg-ModelTown", source: "Gulberg", target: "ModelTown", baseWeight: 15, weight: 15 },
  { id: "Gulberg-Iqbal", source: "Gulberg", target: "Iqbal", baseWeight: 20, weight: 20 },
  { id: "Liberty-Cantt", source: "Liberty", target: "Cantt", baseWeight: 12, weight: 12 },
  { id: "Liberty-DHA", source: "Liberty", target: "DHA", baseWeight: 20, weight: 20 },
  { id: "Cantt-DHA", source: "Cantt", target: "DHA", baseWeight: 15, weight: 15 },
  { id: "Cantt-Anarkali", source: "Cantt", target: "Anarkali", baseWeight: 25, weight: 25 },
  { id: "ModelTown-JoharTown", source: "ModelTown", target: "JoharTown", baseWeight: 15, weight: 15 },
  { id: "ModelTown-Liberty", source: "ModelTown", target: "Liberty", baseWeight: 12, weight: 12 },
  { id: "JoharTown-Iqbal", source: "JoharTown", target: "Iqbal", baseWeight: 20, weight: 20 },
  { id: "JoharTown-DHA", source: "JoharTown", target: "DHA", baseWeight: 25, weight: 25 },
  { id: "Iqbal-Anarkali", source: "Iqbal", target: "Anarkali", baseWeight: 25, weight: 25 },
];

export const ek = (u, v) => [u, v].sort().join("~");

export const useDijkstra = () => {
  const [source, setSource] = useState("Gulberg");
  const [dest, setDest] = useState("");
  const [edges, setEdges] = useState(INITIAL_EDGES);
  const [frames, setFrames] = useState([]);
  const [frameIdx, setFrameIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1100); // ms per step

  const timerRef = useRef(null);

  // Helper to get edge key between two nodes
  const getEdgeKey = useCallback((u, v) => {
    return ek(u, v);
  }, []);

  // Recalculates Dijkstra frames based on the current source and edge weights
  const computeFrames = useCallback((srcNode, currentEdges) => {
    const adj = {};
    currentEdges.forEach(e => {
      const u = e.source;
      const v = e.target;
      const w = e.weight;
      if (!adj[u]) adj[u] = [];
      if (!adj[v]) adj[v] = [];
      adj[u].push([v, w]);
      adj[v].push([u, w]);
    });

    const order = Object.keys(INITIAL_NODES);
    const dist = {};
    const prev = {};
    const done = {};

    order.forEach(n => {
      dist[n] = Infinity;
      prev[n] = null;
      done[n] = false;
    });
    dist[srcNode] = 0;

    const computedFrames = [];
    const snap = (cur, active, tree, msg, type, justSet) => {
      computedFrames.push({
        dist: { ...dist },
        prev: { ...prev },
        done: { ...done },
        current: cur,
        active: new Set(active || []),
        tree: new Set(tree || []),
        msg,
        type,
        justSet: new Set(justSet || []),
      });
    };

    const lbl = (id) => INITIAL_NODES[id]?.label || id;

    snap(null, [], [], `Init: ${lbl(srcNode)} = 0m. All others = \u221E.`, "init", [srcNode]);

    while (true) {
      let u = null;
      let best = Infinity;
      for (const n of order) {
        if (!done[n] && dist[n] < best) {
          best = dist[n];
          u = n;
        }
      }

      if (u === null) break;

      snap(u, [], [], `Evaluating ${lbl(u)} (${dist[u]}m).`, "select");
      done[u] = true;

      const relaxed = [];
      if (adj[u]) {
        for (const [v, w] of adj[u]) {
          if (!done[v]) {
            const alt = dist[u] + w;
            if (alt < dist[v]) {
              dist[v] = alt;
              prev[v] = u;
              relaxed.push(v);
            }
          }
        }
      }

      const active = (adj[u] || [])
        .filter(([v]) => !done[v])
        .map(([v]) => ek(u, v));

      if (relaxed.length) {
        const txt = relaxed.map(v => `${lbl(v)}=${dist[v]}m`).join(", ");
        snap(u, active, [], `Updated: ${txt}.`, "relax", relaxed);
      } else {
        snap(u, [], [], `No faster routes found from ${lbl(u)}.`, "relax");
      }

      snap(null, [], [], `${lbl(u)} routing locked.`, "final");
    }

    const tree = [];
    order.forEach(n => {
      if (prev[n]) {
        tree.push(ek(prev[n], n));
      }
    });

    snap(null, [], tree, `Tactical routing mapped from ${lbl(srcNode)}.`, "done");

    return computedFrames;
  }, []);

  // Compute initial frames
  useEffect(() => {
    const f = computeFrames(source, edges);
    setFrames(f);
    setFrameIdx(0);
  }, [source, edges, computeFrames]);

  // Handle Play/Pause
  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const next = useCallback(() => {
    let advanced = false;
    setFrameIdx((prevIdx) => {
      if (prevIdx < frames.length - 1) {
        advanced = true;
        return prevIdx + 1;
      }
      return prevIdx;
    });
    return advanced;
  }, [frames.length]);

  const play = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsPlaying(true);
    
    // If we are at the end, reset to beginning first
    let currentIdx = frameIdx;
    if (frameIdx >= frames.length - 1) {
      setFrameIdx(0);
      currentIdx = 0;
    }

    timerRef.current = setInterval(() => {
      setFrameIdx((prevIdx) => {
        if (prevIdx < frames.length - 1) {
          return prevIdx + 1;
        } else {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setIsPlaying(false);
          return prevIdx;
        }
      });
    }, speed);
  }, [frameIdx, frames.length, speed]);

  useEffect(() => {
    // If playing and speed changes, restart interval
    if (isPlaying) {
      play();
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [speed, isPlaying, play]);

  const stepForward = useCallback(() => {
    stop();
    next();
  }, [stop, next]);

  const resetSimulation = useCallback(() => {
    stop();
    setFrameIdx(0);
    setDest("");
    setEdges(INITIAL_EDGES);
  }, [stop]);

  // Updates edge weights silently (used for traffic & environmental chaos)
  // preserving the current step frame if possible (re-calculates timeline in background)
  const updateEdgeWeight = useCallback((edgeId, newWeight, labelClass = "") => {
    setEdges((prevEdges) => {
      const nextEdges = prevEdges.map((e) =>
        e.id === edgeId ? { ...e, weight: newWeight, labelClass } : e
      );
      // We don't reset the frame index, the UI will update current frame with new values
      return nextEdges;
    });
  }, []);

  const triggerChaosModifier = useCallback((type) => {
    setEdges((prevEdges) => {
      const nextEdges = prevEdges.map((e) => {
        if (type === "monsoon") {
          // Monsoon Flooding: +15m to all edges connecting to Anarkali
          if (e.source === "Anarkali" || e.target === "Anarkali") {
            return { ...e, weight: e.baseWeight + 15, isTraffic: true };
          }
        } else if (type === "vip") {
          // VIP Blockade: block Cantt edges completely (set to 999)
          if (e.source === "Cantt" || e.target === "Cantt") {
            return { ...e, weight: 999, isTraffic: true };
          }
        }
        return e;
      });
      return nextEdges;
    });
  }, []);

  const resetAllWeights = useCallback(() => {
    setEdges(INITIAL_EDGES);
  }, []);

  const currentFrame = frames[frameIdx] || {
    dist: {},
    prev: {},
    done: {},
    current: null,
    active: new Set(),
    tree: new Set(),
    msg: "Ready",
    type: "init",
    justSet: new Set(),
  };

  return {
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
  };
};
