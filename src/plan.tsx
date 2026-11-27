/**
 * The room engine: geometry in, drawings out.
 *
 * Everything here is computed from the room rectangles in src/data.ts.
 * Nothing in this file knows a room's name, size or position as a literal
 * — change a rectangle in the data and every drawing below changes.
 *
 *   FloorPlan    the full plan: Svg walls, doors, windows and fixtures,
 *                with the room labels laid over it in the rooms' own
 *                rectangles (Svg holds shapes only, so the labels are a
 *                layout overlay whose slices are cut from the same y
 *                coordinates the plan is drawn from).
 *   PlanThumb    the same plan, one room lit in terracotta — used once
 *                per stop of the listing page's tour.
 *   MiniPlan     a box-drawn miniature of the plan for the email, where
 *                Svg cannot go: the same slice geometry, built from
 *                Rows and Columns instead of shapes.
 *
 * Plan coordinates: the viewBox is drawn at 20 px per foot, with a
 * margin round the footprint for the dimension lines.
 */
import { Fragment } from "react";
import {
  Circle,
  Column,
  Ellipse,
  Layer,
  Line,
  Path,
  Polygon,
  Rect,
  Row,
  Svg,
  Text,
  token,
} from "@hyper-elements/react";
import { FOOTPRINT, Room, feet, roomDims, rooms } from "./data";
import { palette } from "./theme";

const S = 20; // px per foot in the viewBox
const OX = 26; // plan origin inside the viewBox
const OY = 26;
const VB_W = OX + FOOTPRINT.widthFt * S + 14;
const VB_H = OY + FOOTPRINT.depthFt * S + 14;

const X = (ft: number) => OX + ft * S;
const Y = (ft: number) => OY + ft * S;

export const toneFill: Record<Room["tone"], string> = {
  living: "#F0E2C8",
  kitchen: "#E9D6B8",
  sleeping: "#F7EFDD",
  wet: "#EBCDB4",
  passage: "#EFE7D3",
};

const WALL = palette.charcoal;
const PLAN_BG = palette.paper;

/* ------------------------------------------------------------------ */
/* Pieces of the drawing                                               */
/* ------------------------------------------------------------------ */

/** A door: erase the wall, draw the leaf and its swing. */
function DoorShapes({ room }: { room: Room }) {
  return (
    <>
      {room.doors.map((door, i) => {
        const horiz = door.wall === "N" || door.wall === "S";
        const wallFt = door.wall === "N" ? room.y : door.wall === "S" ? room.y + room.d : 0;
        const startFt = horiz ? room.x + door.atFt : room.y + door.atFt;
        const endFt = startFt + door.widthFt;
        const px = horiz ? X(startFt) : X(door.wall === "W" ? room.x : room.x + room.w);
        const py = horiz ? Y(wallFt) : Y(startFt);
        const wPx = door.widthFt * S;
        // Inward normal (into the room), in viewBox units.
        const inward =
          door.wall === "N" ? { x: 0, y: 1 } : door.wall === "S" ? { x: 0, y: -1 } : door.wall === "W" ? { x: 1, y: 0 } : { x: -1, y: 0 };
        const leafEnd = { x: px + inward.x * wPx, y: py + inward.y * wPx };
        const openEnd = horiz ? { x: X(endFt), y: py } : { x: px, y: Y(endFt) };
        const sweep = door.wall === "N" || door.wall === "E" ? 0 : 1;
        return (
          <Fragment key={i}>
            <Rect
              x={horiz ? px - 1 : px - 4}
              y={horiz ? py - 4 : py - 1}
              width={horiz ? wPx + 2 : 8}
              height={horiz ? 8 : wPx + 2}
              style={{ fill: toneFill[room.tone] }}
            />
            {door.open ? (
              <>
                <Line
                  x1={horiz ? px : px - 3} y1={horiz ? py - 3 : py}
                  x2={horiz ? openEnd.x : px - 3} y2={horiz ? py - 3 : openEnd.y}
                  style={{ stroke: WALL, strokeWidth: 1.4 }}
                />
                <Line
                  x1={horiz ? px : px + 3} y1={horiz ? py + 3 : py}
                  x2={horiz ? openEnd.x : px + 3} y2={horiz ? py + 3 : openEnd.y}
                  style={{ stroke: WALL, strokeWidth: 1.4 }}
                />
              </>
            ) : (
              <>
                <Line x1={px} y1={py} x2={leafEnd.x} y2={leafEnd.y} style={{ stroke: WALL, strokeWidth: 1.6 }} />
                <Path
                  d={`M ${leafEnd.x} ${leafEnd.y} A ${wPx} ${wPx} 0 0 ${sweep} ${openEnd.x} ${openEnd.y}`}
                  style={{ fill: "rgba(0,0,0,0)", stroke: WALL, strokeWidth: 0.8, opacity: 0.55 }}
                />
              </>
            )}
          </Fragment>
        );
      })}
    </>
  );
}

/** A window: erase the outer wall, draw the three glass lines. */
function WindowShapes({ room }: { room: Room }) {
  return (
    <>
      {room.windows.map((win, i) => {
        const horiz = win.wall === "N" || win.wall === "S";
        const wallFt = win.wall === "N" ? room.y : room.y + room.d;
        const x1 = horiz ? X(room.x + win.atFt) : X(win.wall === "W" ? room.x : room.x + room.w);
        const x2 = horiz ? X(room.x + win.atFt + win.widthFt) : x1;
        const y1 = horiz ? Y(wallFt) : Y(room.y + win.atFt);
        const y2 = horiz ? y1 : Y(room.y + win.atFt + win.widthFt);
        return (
          <Fragment key={i}>
            <Rect
              x={horiz ? x1 : x1 - 4}
              y={horiz ? y1 - 4 : y1}
              width={horiz ? x2 - x1 : 8}
              height={horiz ? 8 : y2 - y1}
              style={{ fill: PLAN_BG }}
            />
            {[-3, 0, 3].map((off) => (
              <Line
                key={off}
                x1={horiz ? x1 : x1 + off}
                y1={horiz ? y1 + off : y1}
                x2={horiz ? x2 : x1 + off}
                y2={horiz ? y1 + off : y2}
                style={{ stroke: WALL, strokeWidth: off === 0 ? 0.8 : 1.2 }}
              />
            ))}
          </Fragment>
        );
      })}
    </>
  );
}

/** The fixed fittings, drawn where the data says they are. */
function FixtureShapes({ room }: { room: Room }) {
  return (
    <>
      {room.fixtures.map((fixture) => {
        switch (fixture) {
          case "fireplace-west":
            return (
              <Fragment key={fixture}>
                <Rect x={X(room.x)} y={Y(room.y + room.d / 2 - 1.5)} width={0.9 * S} height={3 * S} style={{ fill: WALL }} />
                <Rect x={X(room.x) + 3} y={Y(room.y + room.d / 2 - 0.9)} width={0.45 * S} height={1.8 * S} style={{ fill: palette.clay }} />
              </Fragment>
            );
          case "counter-north":
            return (
              <Fragment key={fixture}>
                <Rect x={X(room.x) + 2} y={Y(room.y) + 2} width={room.w * S - 4} height={2 * S} style={{ fill: palette.sandDeep, stroke: WALL, strokeWidth: 1 }} />
                <Rect x={X(room.x + 1)} y={Y(room.y) + 8} width={3.4 * S} height={1.2 * S} style={{ fill: PLAN_BG, stroke: WALL, strokeWidth: 1 }} />
                {[0, 1, 2, 3].map((n) => (
                  <Circle
                    key={n}
                    cx={X(room.x + 8.6) + (n % 2) * 26}
                    cy={Y(room.y) + 13 + Math.floor(n / 2) * 20}
                    r={n % 2 === 0 ? 8 : 6}
                    style={{ fill: palette.sandDeep, stroke: WALL, strokeWidth: 1.1 }}
                  />
                ))}
              </Fragment>
            );
          case "bath-west":
            return (
              <Fragment key={fixture}>
                <Rect x={X(room.x) + 4} y={Y(room.y) + 4} width={2.1 * S} height={5.2 * S} rx={10} style={{ fill: PLAN_BG, stroke: WALL, strokeWidth: 1.2 }} />
                <Rect x={X(room.x) + 9} y={Y(room.y) + 9} width={1.7 * S} height={4.6 * S} rx={8} style={{ fill: palette.white, stroke: WALL, strokeWidth: 0.8 }} />
                <Ellipse cx={X(room.x + room.w - 1.1)} cy={Y(room.y + room.d - 1.2)} rx={0.75 * S} ry={0.95 * S} style={{ fill: PLAN_BG, stroke: WALL, strokeWidth: 1.1 }} />
                <Rect x={X(room.x + 3.4)} y={Y(room.y) + 4} width={1.9 * S} height={1.1 * S} style={{ fill: PLAN_BG, stroke: WALL, strokeWidth: 1.1 }} />
              </Fragment>
            );
          case "washer-north":
            return (
              <Fragment key={fixture}>
                {[0, 1].map((n) => (
                  <Fragment key={n}>
                    <Rect x={X(room.x + 0.4 + n * 2.4)} y={Y(room.y) + 3} width={2.1 * S} height={2.1 * S} style={{ fill: PLAN_BG, stroke: WALL, strokeWidth: 1.1 }} />
                    <Circle cx={X(room.x + 0.4 + n * 2.4) + 1.05 * S} cy={Y(room.y) + 3 + 1.05 * S} r={0.62 * S} style={{ fill: PLAN_BG, stroke: WALL, strokeWidth: 0.9 }} />
                  </Fragment>
                ))}
              </Fragment>
            );
          case "wardrobe-west":
            return (
              <Fragment key={fixture}>
                <Rect x={X(room.x) + 2} y={Y(room.y) + 6} width={1.4 * S} height={(room.d - 1) * S} style={{ fill: palette.sandDeep, stroke: WALL, strokeWidth: 1 }} />
                {[1, 2].map((n) => (
                  <Line
                    key={n}
                    x1={X(room.x) + 2}
                    y1={Y(room.y) + 6 + ((room.d - 1) * S * n) / 3}
                    x2={X(room.x) + 2 + 1.4 * S}
                    y2={Y(room.y) + 6 + ((room.d - 1) * S * n) / 3}
                    style={{ stroke: WALL, strokeWidth: 0.8 }}
                  />
                ))}
              </Fragment>
            );
          default:
            return null;
        }
      })}
    </>
  );
}

/** The whole drawing, as Svg shapes. */
function PlanDrawing({ highlightId }: { highlightId?: string }) {
  return (
    <>
      <Rect x={0} y={0} width={VB_W} height={VB_H} style={{ fill: PLAN_BG }} />
      {/* Dimension lines: overall width (top) and depth (left). */}
      <Line x1={X(0)} y1={OY - 14} x2={X(FOOTPRINT.widthFt)} y2={OY - 14} style={{ stroke: palette.muted, strokeWidth: 1 }} />
      <Line x1={X(0)} y1={OY - 20} x2={X(0)} y2={OY - 8} style={{ stroke: palette.muted, strokeWidth: 1 }} />
      <Line x1={X(FOOTPRINT.widthFt)} y1={OY - 20} x2={X(FOOTPRINT.widthFt)} y2={OY - 8} style={{ stroke: palette.muted, strokeWidth: 1 }} />
      <Line x1={OX - 14} y1={Y(0)} x2={OX - 14} y2={Y(FOOTPRINT.depthFt)} style={{ stroke: palette.muted, strokeWidth: 1 }} />
      <Line x1={OX - 20} y1={Y(0)} x2={OX - 8} y2={Y(0)} style={{ stroke: palette.muted, strokeWidth: 1 }} />
      <Line x1={OX - 20} y1={Y(FOOTPRINT.depthFt)} x2={OX - 8} y2={Y(FOOTPRINT.depthFt)} style={{ stroke: palette.muted, strokeWidth: 1 }} />
      {/* North arrow, top-right corner. */}
      <Circle cx={VB_W - 22} cy={20} r={11} style={{ fill: PLAN_BG, stroke: WALL, strokeWidth: 1 }} />
      <Polygon points={`${VB_W - 22},12 ${VB_W - 17},24 ${VB_W - 22},21 ${VB_W - 27},24`} style={{ fill: palette.clay }} />
      {/* Rooms. */}
      {rooms.map((room) => (
        <Rect
          key={room.id}
          x={X(room.x)}
          y={Y(room.y)}
          width={room.w * S}
          height={room.d * S}
          style={{
            fill: highlightId ? (room.id === highlightId ? palette.clay : toneFill[room.tone]) : toneFill[room.tone],
            stroke: WALL,
            strokeWidth: 2,
            opacity: highlightId && room.id !== highlightId ? 0.5 : 1,
          }}
        />
      ))}
      {rooms.map((room) => (
        <FixtureShapes key={`f-${room.id}`} room={room} />
      ))}
      {rooms.map((room) => (
        <WindowShapes key={`w-${room.id}`} room={room} />
      ))}
      {rooms.map((room) => (
        <DoorShapes key={`d-${room.id}`} room={room} />
      ))}
      {/* The outer wall, drawn last and heaviest. */}
      <Line x1={X(0)} y1={Y(0)} x2={X(FOOTPRINT.widthFt)} y2={Y(0)} style={{ stroke: WALL, strokeWidth: 5 }} />
      <Line x1={X(0)} y1={Y(FOOTPRINT.depthFt)} x2={X(FOOTPRINT.widthFt)} y2={Y(FOOTPRINT.depthFt)} style={{ stroke: WALL, strokeWidth: 5 }} />
      <Line x1={X(0)} y1={Y(0)} x2={X(0)} y2={Y(FOOTPRINT.depthFt)} style={{ stroke: WALL, strokeWidth: 5 }} />
      <Line x1={X(FOOTPRINT.widthFt)} y1={Y(0)} x2={X(FOOTPRINT.widthFt)} y2={Y(FOOTPRINT.depthFt)} style={{ stroke: WALL, strokeWidth: 5 }} />
      {/* Openings in the outer wall must be re-cut after the heavy wall. */}
      {rooms.map((room) => (
        <WindowShapes key={`ow-${room.id}`} room={room} />
      ))}
      {rooms
        .filter((room) => room.id === "living" || room.id === "primary")
        .map((room) => (
          <DoorShapes key={`od-${room.id}`} room={room} />
        ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* The label overlay                                                   */
/* ------------------------------------------------------------------ */

/** Horizontal slices of the house, cut at every room's top and bottom. */
function slices(): Array<{ y0: number; y1: number; rooms: Room[] }> {
  const cuts = Array.from(new Set([0, FOOTPRINT.depthFt, ...rooms.flatMap((r) => [r.y, r.y + r.d])])).sort((a, b) => a - b);
  const out: Array<{ y0: number; y1: number; rooms: Room[] }> = [];
  for (let i = 0; i < cuts.length - 1; i++) {
    const y0 = cuts[i];
    const y1 = cuts[i + 1];
    const covering = rooms.filter((r) => r.y < y1 && r.y + r.d > y0).sort((a, b) => a.x - b.x);
    out.push({ y0, y1, rooms: covering });
  }
  return out;
}

/**
 * Room names and dimensions, laid over the drawing. The overlay is a
 * stack of slice Rows whose heights and widths are the rooms' own feet
 * scaled by the display size — so a label can only ever sit inside the
 * rectangle the plan drew for its room.
 */
function LabelOverlay({ width, highlightId }: { width: number; highlightId?: string }) {
  const k = width / VB_W;
  return (
    <Column
      style={{
        width,
        height: VB_H * k,
        padding: [OY * k, (VB_W - OX - FOOTPRINT.widthFt * S) * k, (VB_H - OY - FOOTPRINT.depthFt * S) * k, OX * k],
        gap: 0,
      }}
    >
      {slices().map((slice) => (
        <Row key={slice.y0} style={{ gap: 0, height: (slice.y1 - slice.y0) * S * k }} stackOnMobile={false}>
          {slice.rooms.map((room) => {
            const starts = room.y === slice.y0;
            const lit = highlightId === room.id;
            // Centre the two label lines arithmetically (name + dims),
            // not with justifyContent: the image engine does not centre
            // a Column's children the way a browser does.
            const sliceH = (slice.y1 - slice.y0) * S * k;
            const labelH = (11.5 * 1.25 + 10 * 1.25 + 1) * k;
            const padTop = Math.max(0, (sliceH - labelH) / 2 + (room.labelDyFt ?? 0) * S * k);
            return (
              <Column
                key={room.id}
                style={{
                  width: room.w * S * k,
                  height: sliceH,
                  flex: "none",
                  alignItems: "center",
                  gap: 1,
                  padding: [padTop, 4, 0],
                }}
              >
                {starts ? (
                  <>
                    <Text
                      style={{
                        fontSize: Math.max(8.5, 11.5 * k),
                        fontWeight: 700,
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                        textAlign: "center",
                        lineHeight: 1.25,
                        color: lit ? palette.white : palette.charcoal,
                      }}
                    >
                      {room.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: Math.max(7.5, 10 * k),
                        textAlign: "center",
                        lineHeight: 1.25,
                        color: lit ? palette.clayPale : palette.muted,
                      }}
                    >
                      {roomDims(room)}
                    </Text>
                  </>
                ) : null}
              </Column>
            );
          })}
        </Row>
      ))}
    </Column>
  );
}

/* ------------------------------------------------------------------ */
/* Public components                                                   */
/* ------------------------------------------------------------------ */

/**
 * The full floor plan at a given display width, with its dimension
 * caption above it. Labels are on unless `labels` is false.
 */
export function FloorPlan({
  width,
  highlightId,
  labels = true,
  caption = true,
  title = "Floor plan of 14 Wrenwood Lane, drawn from the room data.",
  hidden,
}: {
  width: number;
  highlightId?: string;
  labels?: boolean;
  caption?: boolean;
  title?: string;
  hidden?: { mobile?: boolean; desktop?: boolean };
}) {
  const height = (VB_H / VB_W) * width;
  return (
    <Column style={{ gap: 8 }} hidden={hidden}>
      {caption ? (
        <Row style={{ gap: 12, alignItems: "center" }} stackOnMobile={false}>
          <Text style={{ fontSize: 12, color: token("colors.muted"), flex: 1 }}>
            Overall {feet(FOOTPRINT.widthFt)} wide × {feet(FOOTPRINT.depthFt)} deep
          </Text>
          <Text style={{ fontSize: 12, fontWeight: 700, color: palette.clay }}>N ↑</Text>
          <Text style={{ fontSize: 12, color: token("colors.muted") }}>garden ↓</Text>
        </Row>
      ) : null}
      <Layer style={{ width, height }}>
        <Svg width={width} height={height} viewBox={`0 0 ${VB_W} ${VB_H}`} title={title}>
          <PlanDrawing highlightId={highlightId} />
        </Svg>
        {labels ? <LabelOverlay width={width} highlightId={highlightId} /> : null}
      </Layer>
    </Column>
  );
}

/** The plan with one room lit — the tour's way of saying "you are here". */
export function PlanThumb({ roomId, width = 250 }: { roomId: string; width?: number }) {
  return <FloorPlan width={width} highlightId={roomId} labels={false} caption={false} title={`Floor plan with the ${roomId} highlighted.`} />;
}

/**
 * The miniature plan for the email. Email cannot draw Svg, so the same
 * slice geometry is built from boxes: each slice is a Row, each room a
 * bordered Column whose flex is its width in feet, labelled inside.
 */
export function MiniPlan() {
  return (
    <Column style={{ gap: 0, border: { width: 2, style: "solid", color: palette.charcoal } }}>
      {slices().map((slice) => (
        <Row key={slice.y0} style={{ gap: 0 }} stackOnMobile={false}>
          {slice.rooms.map((room) => {
            const starts = room.y === slice.y0;
            return (
              <Column
                key={room.id}
                style={{
                  flex: room.w,
                  height: (slice.y1 - slice.y0) * 7,
                  backgroundColor: toneFill[room.tone],
                  border: { width: 0.5, style: "solid", color: palette.charcoal },
                  alignItems: "center",
                  padding: [starts ? Math.max(1, ((slice.y1 - slice.y0) * 7 - 12) / 2 + (room.labelDyFt ?? 0) * 7) : 0, 2, 0],
                }}
              >
                {starts ? (
                  <Text
                    style={{
                      fontSize: room.id === "hall" ? 8 : 9,
                      fontWeight: 700,
                      letterSpacing: 0.6,
                      textTransform: "uppercase",
                      textAlign: "center",
                      lineHeight: 1.3,
                      color: palette.charcoal,
                    }}
                  >
                    {room.name}
                  </Text>
                ) : null}
              </Column>
            );
          })}
        </Row>
      ))}
    </Column>
  );
}
