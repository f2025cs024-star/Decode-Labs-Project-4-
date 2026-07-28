import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useReactFlow } from '@xyflow/react';

const PathRider = ({ pathNodeIds, isVisible }) => {
  const riderRef = useRef(null);
  const { getNodes } = useReactFlow();
  const animationRef = useRef(null);
  const progressRef = useRef(0); // Progress along the path (0 to pathNodeIds.length - 1)

  useEffect(() => {
    // If not visible or path has less than 2 nodes, clear animation and hide rider
    if (!isVisible || !pathNodeIds || pathNodeIds.length < 2) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      if (riderRef.current) {
        riderRef.current.style.opacity = '0';
      }
      return;
    }

    if (riderRef.current) {
      riderRef.current.style.opacity = '1';
    }

    progressRef.current = 0;

    const animate = () => {
      const nodes = getNodes();
      const pathNodes = pathNodeIds.map(id => nodes.find(n => n.id === id)).filter(Boolean);

      if (pathNodes.length < 2) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Increment progress
      progressRef.current += 0.012; // Controls animation speed
      if (progressRef.current >= pathNodes.length - 1) {
        progressRef.current = 0; // Loop animation
      }

      const currentProgress = progressRef.current;
      const segmentIndex = Math.floor(currentProgress);
      const segmentProgress = currentProgress - segmentIndex;

      const nodeA = pathNodes[segmentIndex];
      const nodeB = pathNodes[segmentIndex + 1];

      if (nodeA && nodeB && riderRef.current) {
        const xA = nodeA.position.x;
        const yA = nodeA.position.y;
        const xB = nodeB.position.x;
        const yB = nodeB.position.y;

        // Linear interpolation between node coordinates
        // Since custom nodes are min-width 120px and some height, let's offset to align at their center.
        // In React Flow, nodes default to a size, but if they have custom styling, we want to point to the center.
        // We can estimate custom node center offsets.
        const widthOffset = 60; // half of min-width 120px
        const heightOffset = 25; // half of height

        const x = xA + widthOffset + (xB - xA) * segmentProgress;
        const y = yA + heightOffset + (yB - yA) * segmentProgress;

        // Apply smooth 3D transform for hardware acceleration
        riderRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [pathNodeIds, isVisible, getNodes]);

  // Find the react-flow viewport to portal the rider element into it
  const viewportEl = document.querySelector('.react-flow__viewport');

  if (!viewportEl) return null;

  return createPortal(
    <div
      ref={riderRef}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        fontSize: '28px',
        zIndex: 50,
        opacity: 0,
        pointerEvents: 'none',
        transition: 'opacity 0.3s',
        filter: 'drop-shadow(0 0 10px #00f5d4)',
      }}
    >
      🛵
    </div>,
    viewportEl
  );
};

export default React.memo(PathRider);
