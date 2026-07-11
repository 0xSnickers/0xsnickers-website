'use client';

import { useEffect, useRef } from 'react';
import { useHomeTheme } from '@/components/home/HomeThemeContext';

type GridCell = {
  x: number;
  y: number;
};

const SPEED = 0.22;
const LIGHT_SPEED = 0.28;
const SQUARE_SIZE = 68;
const HOVER_TRAIL_AMOUNT = 4;
const MAX_DPR = 1.25;
const FRAME_INTERVAL = 1000 / 24;

export default function ShapeGridBackground() {
  const { homeTheme } = useHomeTheme();
  const isDark = homeTheme === 'dark';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const gridOffsetRef = useRef({ x: 0, y: 0 });
  const hoveredCellRef = useRef<GridCell | null>(null);
  const trailCellsRef = useRef<GridCell[]>([]);
  const cellOpacitiesRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let width = 0;
    let height = 0;
    let spotlight: CanvasGradient | null = null;
    let animationEnabled = true;
    let lastFrameTime = 0;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(dpr, dpr);

      spotlight = context.createRadialGradient(
        width * 0.5,
        height * 0.22,
        0,
        width * 0.5,
        height * 0.42,
        Math.max(width, height) * 0.68,
      );
      if (isDark) {
        spotlight.addColorStop(0, 'rgba(2, 6, 23, 0)');
        spotlight.addColorStop(0.52, 'rgba(8, 15, 31, 0.1)');
        spotlight.addColorStop(1, 'rgba(2, 6, 23, 0.56)');
      } else {
        spotlight.addColorStop(0, 'rgba(255, 255, 255, 0)');
        spotlight.addColorStop(0.48, 'rgba(14, 165, 233, 0.025)');
        spotlight.addColorStop(1, 'rgba(2, 132, 199, 0.1)');
      }
    };

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

    const stopAnimation = () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };

    const updateCellOpacities = () => {
      const targets = new Map<string, number>();

      if (hoveredCellRef.current) {
        targets.set(`${hoveredCellRef.current.x},${hoveredCellRef.current.y}`, 1);
      }

      for (let index = 0; index < trailCellsRef.current.length; index += 1) {
        const cell = trailCellsRef.current[index];
        const key = `${cell.x},${cell.y}`;

        if (!targets.has(key)) {
          targets.set(key, (trailCellsRef.current.length - index) / (trailCellsRef.current.length + 1));
        }
      }

      for (const [key] of targets) {
        if (!cellOpacitiesRef.current.has(key)) {
          cellOpacitiesRef.current.set(key, 0);
        }
      }

      for (const [key, opacity] of cellOpacitiesRef.current) {
        const target = targets.get(key) || 0;
        const next = opacity + (target - opacity) * 0.15;

        if (next < 0.01) {
          cellOpacitiesRef.current.delete(key);
        } else {
          cellOpacitiesRef.current.set(key, next);
        }
      }
    };

    const drawGrid = () => {
      const borderColor = isDark ? 'rgba(56, 189, 248, 0.34)' : 'rgba(2, 132, 199, 0.24)';
      const hoverFillColor = isDark ? 'rgba(34, 211, 238, 0.24)' : 'rgba(6, 182, 212, 0.28)';

      context.clearRect(0, 0, width, height);

      const offsetX = ((gridOffsetRef.current.x % SQUARE_SIZE) + SQUARE_SIZE) % SQUARE_SIZE;
      const offsetY = ((gridOffsetRef.current.y % SQUARE_SIZE) + SQUARE_SIZE) % SQUARE_SIZE;
      const columns = Math.ceil(width / SQUARE_SIZE) + 3;
      const rows = Math.ceil(height / SQUARE_SIZE) + 3;

      context.lineWidth = 1;
      context.strokeStyle = borderColor;

      for (const [cellKey, alpha] of cellOpacitiesRef.current) {
        const [column, row] = cellKey.split(',').map(Number);
        context.globalAlpha = alpha;
        context.fillStyle = hoverFillColor;
        context.fillRect(
          column * SQUARE_SIZE + offsetX,
          row * SQUARE_SIZE + offsetY,
          SQUARE_SIZE,
          SQUARE_SIZE,
        );
      }
      context.globalAlpha = 1;

      context.beginPath();
      for (let column = -2; column < columns; column += 1) {
        const x = column * SQUARE_SIZE + offsetX;
        context.moveTo(x, 0);
        context.lineTo(x, height);
      }
      for (let row = -2; row < rows; row += 1) {
        const y = row * SQUARE_SIZE + offsetY;
        context.moveTo(0, y);
        context.lineTo(width, y);
      }
      context.stroke();

      if (spotlight) {
        context.fillStyle = spotlight;
        context.fillRect(0, 0, width, height);
      }
    };

    const animate = (timestamp: number) => {
      if (timestamp - lastFrameTime >= FRAME_INTERVAL) {
        lastFrameTime = timestamp;
        const speed = isDark ? SPEED : LIGHT_SPEED;
        gridOffsetRef.current.x = (gridOffsetRef.current.x - speed + SQUARE_SIZE) % SQUARE_SIZE;
        gridOffsetRef.current.y = (gridOffsetRef.current.y - speed + SQUARE_SIZE) % SQUARE_SIZE;

        updateCellOpacities();
        drawGrid();
      }

      frameRef.current = window.requestAnimationFrame(animate);
    };

    const syncAnimation = () => {
      animationEnabled = !mediaQuery.matches && pointerQuery.matches && !document.hidden;
      stopAnimation();

      if (animationEnabled) {
        lastFrameTime = 0;
        frameRef.current = window.requestAnimationFrame(animate);
      } else {
        drawGrid();
      }
    };

    const handleResize = () => {
      resizeCanvas();
      drawGrid();
    };

    const pushTrail = (cell: GridCell | null) => {
      if (!cell) return;

      trailCellsRef.current.unshift({ ...cell });
      if (trailCellsRef.current.length > HOVER_TRAIL_AMOUNT) {
        trailCellsRef.current.length = HOVER_TRAIL_AMOUNT;
      }
    };

    const handlePointerMove = (event: MouseEvent) => {
      if (!animationEnabled) return;

      const mouseX = event.clientX;
      const mouseY = event.clientY;

      if (mouseX < 0 || mouseY < 0 || mouseX > width || mouseY > height) {
        if (hoveredCellRef.current) {
          pushTrail(hoveredCellRef.current);
          hoveredCellRef.current = null;
        }
        return;
      }

      const offsetX = ((gridOffsetRef.current.x % SQUARE_SIZE) + SQUARE_SIZE) % SQUARE_SIZE;
      const offsetY = ((gridOffsetRef.current.y % SQUARE_SIZE) + SQUARE_SIZE) % SQUARE_SIZE;
      const adjustedX = mouseX - offsetX;
      const adjustedY = mouseY - offsetY;
      const column = Math.floor(adjustedX / SQUARE_SIZE);
      const row = Math.floor(adjustedY / SQUARE_SIZE);

      if (
        !hoveredCellRef.current ||
        hoveredCellRef.current.x !== column ||
        hoveredCellRef.current.y !== row
      ) {
        pushTrail(hoveredCellRef.current);
        hoveredCellRef.current = { x: column, y: row };
      }
    };

    const handlePointerLeave = () => {
      pushTrail(hoveredCellRef.current);
      hoveredCellRef.current = null;
    };

    resizeCanvas();
    drawGrid();
    syncAnimation();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave);
    document.addEventListener('visibilitychange', syncAnimation);
    mediaQuery.addEventListener('change', syncAnimation);
    pointerQuery.addEventListener('change', syncAnimation);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', syncAnimation);
      mediaQuery.removeEventListener('change', syncAnimation);
      pointerQuery.removeEventListener('change', syncAnimation);
      stopAnimation();
    };
  }, [isDark]);

  return (
    <div
      aria-hidden="true"
      className={`shape-grid-shell pointer-events-none fixed inset-0 z-0 overflow-hidden ${isDark ? 'shape-grid-shell-dark' : 'shape-grid-shell-light'}`}
    >
      <canvas ref={canvasRef} className="shape-grid-canvas block h-full w-full border-none" />
    </div>
  );
}
