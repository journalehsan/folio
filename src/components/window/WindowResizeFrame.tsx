import { useCallback } from 'react';
import { startResizeDragging } from '../../tauri/window';
import type { ResizeDirection } from '../../tauri/window';

// ── Sizing constants ──────────────────────────────────────────────────────────
// Edge handle thickness: larger than the 2px visual border for easy grabbing.
const EDGE = 8;
// Corner handle size: square, bigger than edge for comfortable corner grabs.
const CORNER = 14;
// Visible resize grip at SE corner.
const GRIP = 16;

// ── Single resize handle ──────────────────────────────────────────────────────

interface HandleProps {
  direction: ResizeDirection;
  style: React.CSSProperties;
  cursor: string;
}

function Handle({ direction, style, cursor }: HandleProps) {
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Prevent the event from reaching any drag-region or toolbar element below.
      e.preventDefault();
      e.stopPropagation();
      startResizeDragging(direction);
    },
    [direction]
  );

  return (
    <div
      style={{ position: 'fixed', zIndex: 200, cursor, ...style }}
      onMouseDown={onMouseDown}
    />
  );
}

// ── Bottom-right visible grip ─────────────────────────────────────────────────
// Replaces the invisible SE corner handle with a classic diagonal-lines grip.

function ResizeGrip() {
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startResizeDragging('SouthEast');
  }, []);

  return (
    <div
      title="Resize window"
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: GRIP,
        height: GRIP,
        zIndex: 201, // one above the frame so the grip cursor wins
        cursor: 'nwse-resize',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        padding: 3,
      }}
      onMouseDown={onMouseDown}
    >
      {/* Classic 3-line diagonal resize grip */}
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        style={{ display: 'block', opacity: 0.4, flexShrink: 0 }}
        aria-hidden
      >
        <line x1="2.5" y1="9.5" x2="9.5" y2="2.5" stroke="var(--frame-border)" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="5.5" y1="9.5" x2="9.5" y2="5.5" stroke="var(--frame-border)" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="8.5" y1="9.5" x2="9.5" y2="8.5" stroke="var(--frame-border)" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ── WindowResizeFrame ─────────────────────────────────────────────────────────
// Renders:
//   1. A pointer-events-none visual border frame (2px, rounded top corners)
//   2. Eight invisible hit-zone handles (four edges, three corners)
//   3. One visible SE resize grip (replaces the fourth corner handle)
//
// Z-index strategy:
//   content (default) → titlebar (z-50) → resize frame (z-200) →
//   About dialog (z-9998) → menu dropdown (z-9999)
//
// The root TitleBar already has data-tauri-drag-region, so mousedown on the
// resize handles (e.stopPropagation) prevents accidental drag-region activation.

export default function WindowResizeFrame() {
  return (
    <>
      {/* ── Visual border ─────────────────────────────────────────────────── */}
      {/* pointer-events: none so it never blocks clicks on app content.
          border-radius matches the titlebar rounded top corners exactly.
          The border blends with the dark titlebar at the top and becomes
          visible as a subtle dark frame against the light workspace sides. */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          pointerEvents: 'none',
          border: '2px solid var(--frame-border)',
          borderRadius: '7px 7px 0 0',
          boxSizing: 'border-box',
        }}
      />

      {/* ── Edge handles ──────────────────────────────────────────────────── */}
      {/* Each edge spans between the corners to avoid overlap conflicts.    */}
      <Handle direction="North"     cursor="ns-resize"   style={{ top:    0, left:   CORNER, right:  CORNER, height: EDGE   }} />
      <Handle direction="South"     cursor="ns-resize"   style={{ bottom: 0, left:   CORNER, right:  CORNER, height: EDGE   }} />
      <Handle direction="West"      cursor="ew-resize"   style={{ left:   0, top:    CORNER, bottom: CORNER, width:  EDGE   }} />
      <Handle direction="East"      cursor="ew-resize"   style={{ right:  0, top:    CORNER, bottom: CORNER, width:  EDGE   }} />

      {/* ── Corner handles ────────────────────────────────────────────────── */}
      <Handle direction="NorthWest" cursor="nwse-resize" style={{ top:    0, left:   0, width: CORNER, height: CORNER }} />
      <Handle direction="NorthEast" cursor="nesw-resize" style={{ top:    0, right:  0, width: CORNER, height: CORNER }} />
      <Handle direction="SouthWest" cursor="nesw-resize" style={{ bottom: 0, left:   0, width: CORNER, height: CORNER }} />

      {/* ── SE corner — visible grip (acts as both handle and indicator) ─── */}
      <ResizeGrip />
    </>
  );
}
