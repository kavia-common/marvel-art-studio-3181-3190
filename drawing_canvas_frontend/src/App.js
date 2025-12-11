import React, { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";

// --- Marvel-inspired font (Google Fonts import via index.html recommended)
// For now, use strong, bold font-family inline for the header.

// Color palette based on style guide
const COLOR_PALETTE = [
  "#3b82f6", // primary
  "#06b6d4", // success
  "#EF4444", // error
  "#64748b", // secondary
  "#111827", // text
  "#f59e42", // gold/yellow for accent
  "#f9fafb", // background
];

// --- Header Component ---
function MarvelHeader() {
  return (
    <header
      className="marvel-header"
      style={{
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        background: "linear-gradient(to right,#3b82f6 15%, #06b6d4 85%)",
        color: "#fff",
        boxShadow: "0 4px 16px 0 rgba(59,130,246,0.12)",
        zIndex: 11,
      }}
    >
      <h1
        style={{
          margin: 0,
          padding: "0.8rem 0",
          lineHeight: 1,
          fontWeight: 900,
          letterSpacing: "0.08em",
          fontFamily: 'Oswald, Impact, "Arial Black", sans-serif',
          fontSize: "2.2rem",
          textShadow:
            "2px 2px 0 #111827, 4px 4px 8px rgba(6,182,212,0.16)",
          textAlign: "center",
          filter: "drop-shadow(0 1px 0 #06b6d4)",
          userSelect: "none"
        }}
      >
        MARVEL ART STUDIO
      </h1>
    </header>
  );
}

// --- Toolbar Component ---
function Toolbar({
  color,
  setColor,
  brushSize,
  setBrushSize,
  mode,
  setMode,
  onClear,
  onSave,
}) {
  // Custom color chooser support
  const colorInputRef = useRef();

  // Combine palette and custom color
  const handleColorClick = (c) => {
    setColor(c);
    setMode("draw");
    localStorage.setItem("canvas_color", c);
  };
  const handleBrushSize = (e) => {
    const value = Number(e.target.value);
    setBrushSize(value);
    localStorage.setItem("canvas_brush_size", value);
  };

  return (
    <aside className="toolbar-container">
      <div className="toolbar">
        <div className="tool-group">
          {/* Color palette swatches */}
          <label className="tool-label">COLOR</label>
          <div className="palette-row">
            {COLOR_PALETTE.map((c) => (
              <button
                key={c}
                className={`palette-swatch ${c === color && mode === "draw" ? "selected" : ""}`}
                style={{
                  background: c,
                  border:
                    c === color && mode === "draw"
                      ? "2.5px solid #111827"
                      : "2px solid #d1d5db",
                }}
                aria-label={`Select color ${c}`}
                tabIndex={0}
                onClick={() => handleColorClick(c)}
              />
            ))}
            {/* Custom color input */}
            <input
              type="color"
              ref={colorInputRef}
              value={color}
              onChange={(e) => handleColorClick(e.target.value)}
              style={{
                marginLeft: "0.5rem",
                width: "32px",
                height: "32px",
                padding: 0,
                border: "1.5px solid #3b82f6",
                borderRadius: "4px",
                background: "#fff",
                cursor: "pointer",
              }}
              aria-label="Custom color picker"
            />
          </div>
        </div>
        <div className="tool-group">
          {/* Brush Size */}
          <label className="tool-label">BRUSH SIZE</label>
          <input
            type="range"
            min="2"
            max="36"
            step="1"
            value={brushSize}
            aria-label="Brush size slider"
            onChange={handleBrushSize}
            style={{
              accentColor:
                mode === "draw"
                  ? "#3b82f6"
                  : mode === "erase"
                  ? "#EF4444"
                  : "#06b6d4",
            }}
          />
          <span className="brush-size-indicator">
            <svg width="26" height="26">
              <circle
                cx="13"
                cy="13"
                r={brushSize / 2}
                fill={mode === "draw" ? color : "#f9fafb"}
                stroke="#111827"
                strokeWidth={mode === "erase" ? 2.5 : 1.5}
              />
            </svg>
            <span style={{ marginLeft: 6, fontWeight: 700 }}>{brushSize}px</span>
          </span>
        </div>
        <div className="tool-group">
          {/* Tools */}
          <label className="tool-label">TOOLS</label>
          <div className="tool-row">
            <button
              className={`tool-btn ${mode === "draw" ? "active" : ""}`}
              title="Draw Tool (B)"
              aria-label="Draw"
              onClick={() => setMode("draw")}
            >
              {/* Marvel pencil icon SVG */}
              <span role="img" aria-label="Draw Tool">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <rect
                    x="5"
                    y="14"
                    width="2"
                    height="6"
                    fill={mode === "draw" ? color : "#aaa"}
                    stroke="#3b82f6"
                    strokeWidth="0.5"
                  />
                  <rect
                    x="7"
                    y="10"
                    width="2"
                    height="10"
                    fill={mode === "draw" ? color : "#888"}
                    stroke="#3b82f6"
                    strokeWidth="0.5"
                  />
                  <rect
                    x="9"
                    y="2"
                    width="4"
                    height="18"
                    fill={mode === "draw" ? color : "#ccc"}
                    stroke="#3b82f6"
                    strokeWidth="0.5"
                  />
                </svg>
              </span>
            </button>
            <button
              className={`tool-btn ${mode === "erase" ? "active" : ""}`}
              title="Eraser Tool (E)"
              aria-label="Eraser"
              onClick={() => setMode("erase")}
            >
              {/* Marvel eraser SVG */}
              <span role="img" aria-label="Eraser">
                <svg width="22" height="22" fill="none">
                  <rect
                    x="7"
                    y="7"
                    width="8"
                    height="8"
                    rx="2"
                    fill="#f9fafb"
                    stroke={mode === "erase" ? "#EF4444" : "#aaa"}
                    strokeWidth="2"
                  />
                  <rect
                    x="10"
                    y="13"
                    width="8"
                    height="4"
                    rx="1.2"
                    fill="#ccc"
                    stroke="#aaa"
                    strokeWidth="1"
                  />
                </svg>
              </span>
            </button>
            <button
              className="tool-btn"
              title="Clear Canvas (C)"
              aria-label="Clear"
              onClick={onClear}
            >
              {/* Marvel clear icon */}
              <span role="img" aria-label="Clear Canvas">
                <svg width="22" height="22" fill="none">
                  <circle cx="11" cy="11" r="10" stroke="#EF4444" strokeWidth="2.5" fill="none" />
                  <path
                    d="M7 7 L15 15 M15 7 L7 15"
                    stroke="#EF4444"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </button>
            <button
              className="tool-btn"
              title="Save Canvas as PNG (S)"
              aria-label="Save"
              onClick={onSave}
            >
              {/* Marvel save/disk icon */}
              <span role="img" aria-label="Save">
                <svg width="22" height="22" fill="none">
                  <rect
                    x="5"
                    y="5"
                    width="12"
                    height="12"
                    rx="2"
                    fill="#3b82f6"
                    stroke="#06b6d4"
                    strokeWidth="2"
                  />
                  <rect
                    x="8"
                    y="10"
                    width="6"
                    height="5"
                    fill="#fff"
                    stroke="#06b6d4"
                    strokeWidth="1"
                  />
                  <rect
                    x="10"
                    y="7"
                    width="2"
                    height="2"
                    fill="#06b6d4"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

// --- Canvas Component (drawing logic) ---
function CanvasBoard({ color, brushSize, mode, clearSignal }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);

  // Resize/High DPI support
  const parentRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  // Superhero frame border color
  const canvasFrameBorder = "6px solid #3b82f6";

  useEffect(() => {
    function updateSize() {
      if (parentRef.current) {
        let pad = window.innerWidth > 760 ? 36 : 8;
        let w = Math.min(window.innerWidth - 2 * pad, 860);
        let h = Math.max(Math.min(window.innerHeight - (window.innerWidth > 760 ? 240 : 160), 660), 260);
        setSize({ width: w, height: h });
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // --- Drawing Events ---
  // Helper: get relative pos for mouse or touch
  function getPointerPos(e) {
    const boundingRect = canvasRef.current.getBoundingClientRect();
    let clientX, clientY;
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return {
      x: (clientX - boundingRect.left) * (canvasRef.current.width / boundingRect.width),
      y: (clientY - boundingRect.top) * (canvasRef.current.height / boundingRect.height),
    };
  }

  // Start drawing (mouse or touch)
  function handleStart(e) {
    e.preventDefault();
    setDrawing(true);
    setLastPoint(getPointerPos(e));
  }
  // Drawing continue (mouse or touch)
  function handleMove(e) {
    if (!drawing) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = mode === "draw" ? color : "#f9fafb"; // Use background as "eraser"
    ctx.lineWidth = brushSize;

    const point = getPointerPos(e);
    if (lastPoint) {
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
    setLastPoint(point);
  }
  // End drawing (mouse or touch)
  function handleEnd(e) {
    e.preventDefault();
    setDrawing(false);
    setLastPoint(null);
  }

  // Mouse events
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.addEventListener("mousedown", handleStart);
    c.addEventListener("mousemove", handleMove);
    c.addEventListener("mouseup", handleEnd);
    c.addEventListener("mouseleave", handleEnd);
    // Touch events for mobile
    c.addEventListener("touchstart", handleStart, { passive: false });
    c.addEventListener("touchmove", handleMove, { passive: false });
    c.addEventListener("touchend", handleEnd, { passive: false });
    return () => {
      c.removeEventListener("mousedown", handleStart);
      c.removeEventListener("mousemove", handleMove);
      c.removeEventListener("mouseup", handleEnd);
      c.removeEventListener("mouseleave", handleEnd);
      c.removeEventListener("touchstart", handleStart);
      c.removeEventListener("touchmove", handleMove);
      c.removeEventListener("touchend", handleEnd);
    };
    // eslint-disable-next-line
  }, [drawing, color, brushSize, mode, lastPoint]);

  // When canvas size changes, set devicePixelRatio for HiDPI/Retina
  useEffect(() => {
    if (!canvasRef.current) return;
    const ratio = window.devicePixelRatio || 1;
    canvasRef.current.width = size.width * ratio;
    canvasRef.current.height = size.height * ratio;
    canvasRef.current.style.width = `${size.width}px`;
    canvasRef.current.style.height = `${size.height}px`;

    const ctx = canvasRef.current.getContext("2d");
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    // Fill background with white so saved PNGs are not transparent
    ctx.fillStyle = "#f9fafb";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }, [size.width, size.height, clearSignal]);

  // Clear canvas signal
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillStyle = "#f9fafb";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }, [clearSignal]);

  // Add Marvel-style frame overlay, corners, etc.
  return (
    <div
      ref={parentRef}
      className="canvas-frame"
      style={{
        margin: "auto",
        marginTop: "5.5rem",
        marginBottom: "2rem",
        background: "#e0e7ef",
        borderRadius: "1.6rem",
        boxShadow:
          "0 3px 16px 0 rgba(59,130,246,0.16), 0 0.5px 2.5px #06b6d440",
        border: canvasFrameBorder,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          background: "#f9fafb",
          touchAction: "none",
          display: "block",
          borderRadius: "1.2rem",
          boxShadow:
            "0 1px 8px rgba(6,182,212, 0.09), 0 0.5px 1px #11182710",
          outline: "3.5px double #06b6d4"
        }}
        tabIndex={0}
        width={size.width * (window.devicePixelRatio || 1)}
        height={size.height * (window.devicePixelRatio || 1)}
        aria-label="Marvel drawing canvas"
      />
      {/* Marvel iconological corner accents (simulate superhero frame) */}
      <div className="frame-corner" style={{
        top: 4,
        left: 12,
        background: "#3b82f6",
        border: "2px solid #06b6d4"
      }}/>
      <div className="frame-corner" style={{
        top: 4,
        right: 12,
        background: "#06b6d4",
        border: "2px solid #3b82f6"
      }}/>
      <div className="frame-corner" style={{
        bottom: 4,
        left: 12,
        background: "#EF4444",
        border: "2px solid #3b82f6"
      }}/>
      <div className="frame-corner" style={{
        bottom: 4,
        right: 12,
        background: "#f59e42",
        border: "2px solid #06b6d4"
      }}/>
    </div>
  );
}

// --- LocalStorage helpers ---
function getPersisted(opt, fallback) {
  try {
    let val = localStorage.getItem(opt);
    if (val === null) return fallback;
    if (opt === "canvas_brush_size") return Number(val);
    return val;
  } catch {
    return fallback;
  }
}

function App() {
  // Theme always light for this Marvel app (but could extend)
  const [color, setColor] = useState(getPersisted("canvas_color", "#3b82f6"));
  const [brushSize, setBrushSize] = useState(
    getPersisted("canvas_brush_size", 8)
  );
  const [mode, setMode] = useState("draw"); // or 'erase'

  // Used to signal clear event to canvas
  const [clearSignal, setClearSignal] = useState(0);

  // Keyboard shortcuts: S-save, C-clear, B-brush/draw, E-eraser
  const handleKeyDown = useCallback(
    (e) => {
      if (e.target.nodeName === "INPUT") return; // Don't interfere with input fields
      if (e.key.toLowerCase() === "e") {
        setMode("erase");
      } else if (e.key.toLowerCase() === "c") {
        handleClear();
      } else if (e.key.toLowerCase() === "b") {
        setMode("draw");
      } else if (e.key.toLowerCase() === "s") {
        handleSave();
      }
    },
    // eslint-disable-next-line
    [color, brushSize, mode]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // --- Toolbar actions ---
  function handleClear() {
    setClearSignal((n) => n + 1);
  }

  function handleSave() {
    // Download PNG of canvas
    const canvasEl = document.querySelector(".canvas-frame canvas");
    if (!canvasEl) return;
    const link = document.createElement("a");
    link.download = "marvel_artwork.png";
    link.href = canvasEl.toDataURL("image/png");
    link.click();
  }

  return (
    <div
      className="App marvel-app-container"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#f9fafb 90%,#3b82f618)",
        paddingTop: "4.2rem",
        display: "flex",
        flexDirection: "column",
      }}
      data-theme="light"
    >
      <MarvelHeader />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "flex-start",
          flexWrap: "wrap",
          width: "100vw",
          maxWidth: "1160px",
          margin: "0 auto",
          marginTop: "3.8rem",
        }}
      >
        <Toolbar
          color={color}
          setColor={setColor}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          mode={mode}
          setMode={setMode}
          onClear={handleClear}
          onSave={handleSave}
        />
        <CanvasBoard
          color={color}
          brushSize={brushSize}
          mode={mode}
          clearSignal={clearSignal}
        />
      </div>
      {/* Legend and shortcuts info */}
      <footer className="marvel-shortcuts-footer" style={{
        marginTop: "auto",
        textAlign: "center",
        color: "#64748b",
        background: "#ffffffcc",
        padding: "0.85rem 0 1.2rem",
        letterSpacing: "0.04em",
        fontWeight: 500,
        fontSize: "1rem",
        borderTop: "1.5px solid #06b6d4",
      }}>
        <span style={{ color: "#3b82f6", fontWeight: 700 }}>Marvel Art Studio</span>
        &nbsp;· Brush <b>B</b> · Eraser <b>E</b> · Clear <b>C</b> · Save <b>S</b>
      </footer>
    </div>
  );
}

export default App;
