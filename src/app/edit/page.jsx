"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";

/**
 * Мини-редактор в стиле ScreenSnapPro/Figma:
 * - Фон: красный/чёрный/белый
 * - Импорт изображения: input и drag&drop
 * - Инструменты: Select, Rect, Ellipse, Arrow, Pixelate (область)
 * - Трансформации: перемещение, resize (8 хэндлов), rotate (верхний круг)
 * - Удаление: Del/Backspace
 * - Экспорт: PNG
 *
 * Без сторонних библиотек.
 */

const TOOLS = {
    SELECT: "select",
    RECT: "rect",
    ELLIPSE: "ellipse",
    ARROW: "arrow",
    PIXELATE: "pixelate",
};

const HANDLE_SIZE = 8;
const ROTATE_HANDLE_OFFSET = 28;
const SNAP_ANGLE = (Math.PI / 180) * 5; // шаг снапа 5°

export default function Page() {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [ctx, setCtx] = useState(null);
    const [bg, setBg] = useState("white");
    const [tool, setTool] = useState(TOOLS.SELECT);
    const [objects, setObjects] = useState([]); // {id,type,x,y,w,h,rotation,color,stroke,strokeWidth, data(for image/arrow)}
    const [activeId, setActiveId] = useState(null);
    const [drag, setDrag] = useState(null); // {mode: 'move'|'resize'|'rotate'|'draw'|'pixelate', startX, startY, ...}
    const [pixelBox, setPixelBox] = useState(null); // временная рамка пикселизации
    const offscreen = useRef(document.createElement("canvas"));

    // Инициализация
    useEffect(() => {
        const c = canvasRef.current;
        c.width = 1000;
        c.height = 650;
        const _ctx = c.getContext("2d");
        setCtx(_ctx);

        // Клавиши удаления/экспорт
        const onKey = (e) => {
            if ((e.key === "Delete" || e.key === "Backspace") && activeId) {
                setObjects((prev) => prev.filter((o) => o.id !== activeId));
                setActiveId(null);
            }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
                e.preventDefault();
                handleExport();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [activeId]);

    // Перерисовка
    useEffect(() => {
        if (!ctx) return;
        drawAll();
    }, [ctx, bg, objects, activeId, pixelBox]);

    // DnD загрузка
    useEffect(() => {
        const holder = containerRef.current;
        if (!holder) return;
        const prevent = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };
        const onDrop = (e) => {
            prevent(e);
            const file = e.dataTransfer.files?.[0];
            if (file) loadImageFile(file);
        };
        ["dragenter", "dragover", "dragleave", "drop"].forEach((ev) =>
            holder.addEventListener(ev, prevent)
        );
        holder.addEventListener("drop", onDrop);
        return () => {
            ["dragenter", "dragover", "dragleave", "drop"].forEach((ev) =>
                holder.removeEventListener(ev, prevent)
            );
            holder.removeEventListener("drop", onDrop);
        };
    }, []);

    const drawAll = () => {
        const c = ctx.canvas;
        // фон
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, c.width, c.height);

        // объекты
        for (const o of objects) {
            drawObject(ctx, o);
            if (o.id === activeId && tool === TOOLS.SELECT) {
                drawSelection(ctx, o);
            }
        }

        // рамка пикселизации (интерактивная)
        if (tool === TOOLS.PIXELATE && pixelBox) {
            const { x, y, w, h } = normRect(pixelBox);
            ctx.save();
            ctx.strokeStyle = "rgba(59,130,246,1)";
            ctx.setLineDash([6, 4]);
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x, y, w, h);
            ctx.restore();
        }
    };

    // ===== helpers render =====
    const drawObject = (ctx, o) => {
        ctx.save();
        // перенос в центр объекта для ротации
        const cx = o.x + o.w / 2;
        const cy = o.y + o.h / 2;
        ctx.translate(cx, cy);
        ctx.rotate(o.rotation || 0);
        ctx.translate(-cx, -cy);

        if (o.type === "rect") {
            ctx.fillStyle = o.color || "rgba(0,0,0,0.6)";
            if (o.strokeWidth) {
                ctx.lineWidth = o.strokeWidth;
                ctx.strokeStyle = o.stroke || "transparent";
                ctx.strokeRect(o.x, o.y, o.w, o.h);
            }
            ctx.fillRect(o.x, o.y, o.w, o.h);
        } else if (o.type === "ellipse") {
            ctx.beginPath();
            ctx.ellipse(o.x + o.w / 2, o.y + o.h / 2, Math.abs(o.w / 2), Math.abs(o.h / 2), 0, 0, Math.PI * 2);
            if (o.strokeWidth) {
                ctx.lineWidth = o.strokeWidth;
                ctx.strokeStyle = o.stroke || "transparent";
                ctx.stroke();
            }
            ctx.fillStyle = o.color || "rgba(0,0,0,0.6)";
            ctx.fill();
        } else if (o.type === "arrow") {
            // Линия со стрелкой (внутри bbox)
            ctx.strokeStyle = o.stroke || "#10b981";
            ctx.fillStyle = o.stroke || "#10b981";
            ctx.lineWidth = o.strokeWidth || 3;
            // Линия (из левого центра к правому центру bbox)
            const x1 = o.x + 10, y1 = o.y + o.h / 2;
            const x2 = o.x + o.w - 10, y2 = o.y + o.h / 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            // Наконечник
            const ah = 14, aw = 9;
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - ah, y2 - aw);
            ctx.lineTo(x2 - ah, y2 + aw);
            ctx.closePath();
            ctx.fill();
        } else if (o.type === "image" && o.img) {
            ctx.drawImage(o.img, o.x, o.y, o.w, o.h);
        }
        ctx.restore();
    };

    const drawSelection = (ctx, o) => {
        ctx.save();
        const cx = o.x + o.w / 2;
        const cy = o.y + o.h / 2;
        ctx.translate(cx, cy);
        ctx.rotate(o.rotation || 0);
        ctx.translate(-cx, -cy);

        // рамка
        ctx.strokeStyle = "#3b82f6";
        ctx.setLineDash([6, 4]);
        ctx.lineWidth = 1.5;
        ctx.strokeRect(o.x, o.y, o.w, o.h);

        // хэндлы resize (8 штук)
        const handles = getResizeHandles(o);
        ctx.setLineDash([]);
        ctx.fillStyle = "#2563eb";
        handles.forEach((h) => {
            ctx.fillRect(h.x - HANDLE_SIZE / 2, h.y - HANDLE_SIZE / 2, HANDLE_SIZE, HANDLE_SIZE);
        });

        // хэндл rotate
        const rot = getRotateHandle(o);
        ctx.beginPath();
        ctx.arc(rot.x, rot.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = "#2563eb";
        ctx.fill();

        ctx.restore();
    };

    // ===== mouse math =====
    const screenToCanvas = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    // проверка попадания курсора в объект с учётом ротации
    const hitObject = (pt, o) => {
        // обратный поворот точки относительно центра
        const cx = o.x + o.w / 2, cy = o.y + o.h / 2;
        const s = Math.sin(-(o.rotation || 0)), c = Math.cos(-(o.rotation || 0));
        const dx = pt.x - cx, dy = pt.y - cy;
        const rx = dx * c - dy * s + cx;
        const ry = dx * s + dy * c + cy;
        return rx >= o.x && rx <= o.x + o.w && ry >= o.y && ry <= o.y + o.h;
    };

    const getResizeHandles = (o) => {
        const corners = [
            { name: "nw", x: o.x, y: o.y },
            { name: "n", x: o.x + o.w / 2, y: o.y },
            { name: "ne", x: o.x + o.w, y: o.y },
            { name: "e", x: o.x + o.w, y: o.y + o.h / 2 },
            { name: "se", x: o.x + o.w, y: o.y + o.h },
            { name: "s", x: o.x + o.w / 2, y: o.y + o.h },
            { name: "sw", x: o.x, y: o.y + o.h },
            { name: "w", x: o.x, y: o.y + o.h / 2 },
        ];
        // поворот точек хэндлов
        const cx = o.x + o.w / 2, cy = o.y + o.h / 2;
        const sin = Math.sin(o.rotation || 0), cos = Math.cos(o.rotation || 0);
        return corners.map((p) => {
            const dx = p.x - cx, dy = p.y - cy;
            return {
                name: p.name,
                x: cx + dx * cos - dy * sin,
                y: cy + dx * sin + dy * cos,
            };
        });
    };

    const getRotateHandle = (o) => {
        const cx = o.x + o.w / 2, cy = o.y;
        const angle = o.rotation || 0;
        const rx = cx + Math.sin(angle) * (-ROTATE_HANDLE_OFFSET);
        const ry = cy - Math.cos(angle) * ROTATE_HANDLE_OFFSET;
        return { x: rx, y: ry };
    };

    const whichHandle = (pt, o) => {
        // проверка на rotate
        const r = getRotateHandle(o);
        if (dist(pt, r) <= 10) return { type: "rotate" };

        // проверка на resize
        const hs = getResizeHandles(o);
        for (const h of hs) {
            if (Math.abs(pt.x - h.x) <= HANDLE_SIZE && Math.abs(pt.y - h.y) <= HANDLE_SIZE) {
                return { type: "resize", name: h.name };
            }
        }
        return null;
    };

    const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

    const normRect = (r) => {
        const x = Math.min(r.x, r.x2);
        const y = Math.min(r.y, r.y2);
        const w = Math.abs(r.x2 - r.x);
        const h = Math.abs(r.y2 - r.y);
        return { x, y, w, h };
    };

    // ===== mouse events =====
    const onMouseDown = (e) => {
        if (!ctx) return;
        const pt = screenToCanvas(e);

        if (tool === TOOLS.PIXELATE) {
            setPixelBox({ x: pt.x, y: pt.y, x2: pt.x, y2: pt.y });
            setDrag({ mode: "pixelate", startX: pt.x, startY: pt.y });
            return;
        }

        // проверяем активный объект
        const hit = [...objects].reverse().find((o) => hitObject(pt, o)); // верхний сначала
        const current = objects.find((o) => o.id === activeId) || null;

        // если есть активный — проверяем хэндлы
        if (current && hitObject(pt, current)) {
            const h = whichHandle(pt, current);
            if (h?.type === "rotate") {
                setDrag({ mode: "rotate", id: current.id, start: pt });
                return;
            }
            if (h?.type === "resize") {
                setDrag({ mode: "resize", id: current.id, handle: h.name, start: pt, orig: { ...current } });
                return;
            }
        }

        // попали в объект — двигаем
        if (hit) {
            setActiveId(hit.id);
            setDrag({ mode: "move", id: hit.id, start: pt, orig: { x: hit.x, y: hit.y } });
            // переносим объект наверх (как Figma bring to front on select)
            setObjects((prev) => {
                const rest = prev.filter((o) => o.id !== hit.id);
                return [...rest, hit];
            });
            return;
        }

        // иначе — рисуем новый по инструменту
        if (tool === TOOLS.RECT || tool === TOOLS.ELLIPSE || tool === TOOLS.ARROW) {
            const id = crypto.randomUUID?.() || String(Date.now());
            const base = {
                id,
                x: pt.x,
                y: pt.y,
                w: 1,
                h: 1,
                rotation: 0,
                stroke: tool === TOOLS.ARROW ? "#10b981" : "#1d4ed8",
                strokeWidth: tool === TOOLS.ARROW ? 3 : 2,
                color: tool === TOOLS.ARROW ? "transparent" : "rgba(29,78,216,0.18)",
                type:
                    tool === TOOLS.RECT ? "rect" : tool === TOOLS.ELLIPSE ? "ellipse" : "arrow",
            };
            setObjects((prev) => [...prev, base]);
            setActiveId(id);
            setDrag({ mode: "draw", id, start: pt });
            return;
        }

        // select пусто
        setActiveId(null);
    };

    const onMouseMove = (e) => {
        if (!drag || !ctx) return;
        const pt = screenToCanvas(e);

        if (drag.mode === "draw") {
            setObjects((prev) =>
                prev.map((o) =>
                    o.id === drag.id ? { ...o, w: pt.x - o.x, h: pt.y - o.y } : o
                )
            );
            return;
        }

        if (drag.mode === "move") {
            const dx = pt.x - drag.start.x;
            const dy = pt.y - drag.start.y;
            setObjects((prev) =>
                prev.map((o) =>
                    o.id === drag.id ? { ...o, x: drag.orig.x + dx, y: drag.orig.y + dy } : o
                )
            );
            return;
        }

        if (drag.mode === "resize") {
            const obj = objects.find((o) => o.id === drag.id);
            if (!obj) return;

            // преобразуем pt в локальные координаты без поворота
            const cx = drag.orig.x + drag.orig.w / 2;
            const cy = drag.orig.y + drag.orig.h / 2;
            const s = Math.sin(-(drag.orig.rotation || 0));
            const c = Math.cos(-(drag.orig.rotation || 0));
            const dx = pt.x - cx, dy = pt.y - cy;
            const rx = dx * c - dy * s + cx;
            const ry = dx * s + dy * c + cy;

            let { x, y, w, h } = drag.orig;
            const minSize = 8;

            const apply = (nx, ny, nw, nh) => {
                // корректируем чтобы w/h соответствовали направлению (могут уйти в отрицательные)
                let _x = nx, _y = ny, _w = nw, _h = nh;
                if (_w < 0) { _x += _w; _w = -_w; }
                if (_h < 0) { _y += _h; _h = -_h; }
                _w = Math.max(minSize, _w);
                _h = Math.max(minSize, _h);
                setObjects((prev) => prev.map((o) => (o.id === drag.id ? { ...o, x: _x, y: _y, w: _w, h: _h } : o)));
            };

            switch (drag.handle) {
                case "e": apply(x, y, rx - x, h); break;
                case "w": apply(rx, y, x + w - rx, h); break;
                case "s": apply(x, y, w, ry - y); break;
                case "n": apply(x, ry, w, y + h - ry); break;
                case "se": apply(x, y, rx - x, ry - y); break;
                case "ne": apply(x, ry, rx - x, y - ry); break;
                case "sw": apply(rx, y, x - rx, ry - y); break;
                case "nw": apply(rx, ry, x - rx, y - ry); break;
            }
            return;
        }

        if (drag.mode === "rotate") {
            const obj = objects.find((o) => o.id === drag.id);
            if (!obj) return;
            const cx = obj.x + obj.w / 2, cy = obj.y + obj.h / 2;
            const angle = Math.atan2(pt.y - cy, pt.x - cx) + Math.PI / 2; // вверх — 0°
            // снапим
            const snapped = Math.round(angle / SNAP_ANGLE) * SNAP_ANGLE;
            setObjects((prev) => prev.map((o) => (o.id === obj.id ? { ...o, rotation: snapped } : o)));
            return;
        }

        if (drag.mode === "pixelate" && pixelBox) {
            setPixelBox({ ...pixelBox, x2: pt.x, y2: pt.y });
            return;
        }
    };

    const onMouseUp = () => {
        if (drag?.mode === "pixelate" && pixelBox) {
            applyPixelate(pixelBox);
            setPixelBox(null);
        }
        setDrag(null);
    };

    // ===== pixelate =====
    const applyPixelate = (box) => {
        const { x, y, w, h } = normRect(box);
        if (w < 4 || h < 4) return;
        const c = ctx.canvas;

        // Сохранить область -> пикселизировать на оффскрине -> вернуть
        const temp = document.createElement("canvas");
        temp.width = w;
        temp.height = h;
        const tctx = temp.getContext("2d");
        tctx.drawImage(c, x, y, w, h, 0, 0, w, h);

        // пикселизация: уменьшить, затем увеличить без сглаживания
        const scale = 0.1; // чем меньше — тем сильнее эффект
        const smallW = Math.max(1, Math.floor(w * scale));
        const smallH = Math.max(1, Math.floor(h * scale));
        offscreen.current.width = smallW;
        offscreen.current.height = smallH;
        const octx = offscreen.current.getContext("2d");
        octx.imageSmoothingEnabled = false;
        octx.drawImage(temp, 0, 0, smallW, smallH);

        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(offscreen.current, x, y, w, h);
        ctx.restore();
    };

    // ===== image load =====
    const onFile = (e) => {
        const file = e.target.files?.[0];
        if (file) loadImageFile(file);
    };

    const loadImageFile = (file) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const id = crypto.randomUUID?.() || String(Date.now());
                const fitW = Math.min(700, img.width);
                const ratio = fitW / img.width;
                const fitH = img.height * ratio;
                setObjects((prev) => [
                    ...prev,
                    {
                        id,
                        type: "image",
                        x: 150,
                        y: 100,
                        w: fitW,
                        h: fitH,
                        rotation: 0,
                        img,
                    },
                ]);
                setActiveId(id);
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    };

    // ===== export =====
    const handleExport = () => {
        const url = canvasRef.current.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = "screensnappro-clone.png";
        a.click();
    };

    // ===== UI =====
    return (
        <main className="p-4">
            <div ref={containerRef} className="mx-auto max-w-[1100px]">
                <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h1 className="text-lg font-semibold">ScreenSnapPro — Clone (Canvas)</h1>

                    <div className="flex items-center gap-2">
                        <span className="text-sm">Фон:</span>
                        <button onClick={() => setBg("red")} className="px-2 py-1 rounded bg-red-600 text-white">красный</button>
                        <button onClick={() => setBg("black")} className="px-2 py-1 rounded bg-black text-white">чёрный</button>
                        <button onClick={() => setBg("white")} className="px-2 py-1 rounded border">белый</button>

                        <input type="file" accept="image/*" onChange={onFile}
                            className="ml-3 rounded border px-2 py-1" />
                        <button onClick={handleExport} className="rounded bg-emerald-600 px-3 py-1 text-white">
                            Export PNG
                        </button>
                    </div>
                </header>

                <div className="mb-3 flex items-center gap-2">
                    <ToolButton active={tool === TOOLS.SELECT} onClick={() => setTool(TOOLS.SELECT)}>Select (V)</ToolButton>
                    <ToolButton active={tool === TOOLS.RECT} onClick={() => setTool(TOOLS.RECT)}>Rect (R)</ToolButton>
                    <ToolButton active={tool === TOOLS.ELLIPSE} onClick={() => setTool(TOOLS.ELLIPSE)}>Ellipse (O)</ToolButton>
                    <ToolButton active={tool === TOOLS.ARROW} onClick={() => setTool(TOOLS.ARROW)}>Arrow (A)</ToolButton>
                    <ToolButton active={tool === TOOLS.PIXELATE} onClick={() => setTool(TOOLS.PIXELATE)}>Pixelate (P)</ToolButton>
                    <span className="text-xs text-neutral-500 ml-2">Удалить: Del/Backspace • Перетаскивай файлы прямо на холст</span>
                </div>

                <div
                    className="relative rounded-lg border bg-[conic-gradient(at_20%_20%,rgba(0,0,0,0.04),rgba(0,0,0,0.02)_25%,transparent_0_50%,rgba(0,0,0,0.02)_0_75%,transparent_0)] p-3"
                >
                    <canvas
                        ref={canvasRef}
                        className="block w-full cursor-crosshair rounded bg-transparent"
                        onMouseDown={onMouseDown}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                    />
                </div>
            </div>
        </main>
    );
}

// Кнопка инструмента
function ToolButton({ active, onClick, children }) {
    return (
        <button
            onClick={onClick}
            className={`rounded px-3 py-1 text-sm ${active ? "bg-blue-600 text-white" : "border"
                }`}
        >
            {children}
        </button>
    );
}
