/**
 * The Viewing — everything about one house, held as data.
 *
 * The heart of this kit is the ROOM LIST further down. A room is not a
 * paragraph of copy: it is a rectangle with a name, a position inside the
 * house footprint, doors, windows, fixtures, features and a tour note.
 * Every spatial thing in the kit is computed from those rectangles:
 *
 *   - the floor plan drawn on the listing page (src/plan.tsx),
 *   - the small plan tucked into the confirmation email,
 *   - the room table on the printed fact sheet,
 *   - the room-by-room tour on the listing page.
 *
 * Move a room here — change its x/y — and all four move with it. Resize
 * one and its printed dimensions, its area and its plan outline change
 * together, because none of them are written anywhere else.
 *
 * All of it is invented: the agency, the house, the street, the viewer,
 * the agent and the price are sample data for a template.
 */

/* ------------------------------------------------------------------ */
/* The people and the appointment                                      */
/* ------------------------------------------------------------------ */

export const agency = {
  name: "Keystone Estates",
  strapline: "Independent estate agents · Alderbridge",
  office: "3 Market Square, Alderbridge",
  phone: "+1 (555) 210-4416",
  phoneHref: "tel:+15552104416",
  email: "viewings@keystoneestates.example",
  site: "keystoneestates.example",
} as const;

export const agent = {
  name: "Elena Marsh",
  role: "Senior agent, Keystone Estates",
  mobile: "+1 (555) 210-4417",
  mobileHref: "tel:+15552104417",
  note: "Elena will meet you at the front door. If you are running late, call her mobile — the slot can stretch by ten minutes, but not more; another viewer is booked after you.",
} as const;

export const viewer = {
  firstName: "Omar",
  fullName: "Omar Haddad",
  party: "2 adults",
} as const;

export const viewing = {
  dayName: "Saturday",
  dateLabel: "Saturday, 12 December 2026",
  dateShort: "Sat 12 Dec 2026",
  time: "11:30 AM",
  timeShort: "11:30",
  duration: "45 minutes",
  arriveBy: "11:20 AM",
  reference: "KW-14-1130",
  confirmHref: "https://keystoneestates.example/viewings/KW-14-1130",
} as const;

/* ------------------------------------------------------------------ */
/* The house, in headline numbers                                      */
/* ------------------------------------------------------------------ */

export const house = {
  address: "14 Wrenwood Lane",
  town: "Alderbridge",
  priceCents: 68500000,
  tenure: "Freehold",
  built: 1934,
  plot: "0.18 acre, south-facing rear garden",
  parking: "Single garage and a two-car drive",
  heating: "Gas central heating, boiler replaced 2023",
  summary:
    "A 1934 detached house on a quiet lane, kept by the same family for thirty years and now ready for its next one. Three bedrooms, a fireplace in the living room, a kitchen that catches the morning, and a garden that catches the afternoon.",
} as const;

/** Format integer cents as whole dollars, e.g. 68500000 -> "$685,000". */
export function usd(cents: number): string {
  return "$" + Math.round(cents / 100).toLocaleString("en-US");
}

/** Feet as a dimension string, e.g. 15 -> 15'-0", 7.5 -> 7'-6". */
export function feet(ft: number): string {
  const whole = Math.floor(ft);
  const inches = Math.round((ft - whole) * 12);
  return `${whole}'-${inches}"`;
}

/* ------------------------------------------------------------------ */
/* THE ROOMS — the single spatial source                               */
/*                                                                     */
/* The house footprint is 40 ft wide (x, west→east) by 28 ft deep      */
/* (y, north→south). The street is to the north (y = 0); the garden    */
/* is to the south (y = 28). Every room is a rectangle inside that     */
/* footprint. `tone` picks the fill the plan paints it with.           */
/* ------------------------------------------------------------------ */

export const FOOTPRINT = { widthFt: 40, depthFt: 28 } as const;

export type Wall = "N" | "S" | "E" | "W";

export interface Doorway {
  /** Which wall of the room the door sits in. */
  wall: Wall;
  /** Distance in feet from the wall's start corner (west or north end). */
  atFt: number;
  widthFt: number;
  /** A wide opening with no swinging leaf (e.g. garden doors). */
  open?: boolean;
}

export interface WindowOpening {
  wall: Wall;
  atFt: number;
  widthFt: number;
}

export type Fixture =
  | "fireplace-west"
  | "counter-north"
  | "bath-west"
  | "washer-north"
  | "wardrobe-west";

export interface Room {
  id: string;
  name: string;
  /** West edge, feet from the house's west wall. */
  x: number;
  /** North edge, feet from the house's north wall. */
  y: number;
  /** Width (west→east), feet. */
  w: number;
  /** Depth (north→south), feet. */
  d: number;
  tone: "living" | "kitchen" | "sleeping" | "wet" | "passage";
  doors: Doorway[];
  windows: WindowOpening[];
  fixtures: Fixture[];
  features: string[];
  /** What the agent will point out when you stand in this room. */
  tourNote: string;
  /** Whether the listing page gives this room its own tour stop. */
  tour: boolean;
  /** Nudge the plan label down (feet) where fixtures crowd the centre. */
  labelDyFt?: number;
}

export const rooms: Room[] = [
  {
    id: "living",
    name: "Living Room",
    x: 0, y: 0, w: 15, d: 12,
    tone: "living",
    doors: [
      { wall: "N", atFt: 2.5, widthFt: 3 }, // the front door
      { wall: "S", atFt: 11, widthFt: 3 },
    ],
    windows: [{ wall: "N", atFt: 7.5, widthFt: 6 }],
    fixtures: ["fireplace-west"],
    features: ["Working open fireplace", "Bay window to the lane", "Oak floorboards"],
    tourNote:
      "The room the house is organised around. Stand in the bay at 11:30 and you get the light the current owners have had every morning for thirty years.",
    tour: true,
  },
  {
    id: "kitchen",
    name: "Kitchen",
    x: 15, y: 0, w: 12, d: 12,
    tone: "kitchen",
    doors: [{ wall: "S", atFt: 2, widthFt: 3 }],
    windows: [{ wall: "N", atFt: 3, widthFt: 6 }],
    fixtures: ["counter-north"],
    features: ["Stone worktops", "Range cooker", "Walk-in pantry off the hall door"],
    tourNote:
      "Counters run the full north wall under the window, so the washing-up view is the lane, not a fence. The pantry is deeper than it looks — step in.",
    tour: true,
  },
  {
    id: "dining",
    name: "Dining Room",
    x: 27, y: 0, w: 13, d: 12,
    tone: "living",
    doors: [{ wall: "S", atFt: 3, widthFt: 3 }],
    windows: [{ wall: "N", atFt: 3.5, widthFt: 7 }],
    fixtures: [],
    features: ["Seats ten comfortably", "Pendant rail over the table", "Original picture rail"],
    tourNote:
      "A separate dining room, not a corner of the kitchen. The current owners use it as a study half the week — the picture rail and the deep window suit both.",
    tour: true,
  },
  {
    id: "hall",
    name: "Hall",
    x: 0, y: 12, w: 40, d: 4,
    tone: "passage",
    doors: [],
    windows: [],
    fixtures: [],
    features: ["Coat cupboard by the living-room door", "Oak floor continues through"],
    tourNote: "Every room opens off the hall; nothing is reached through another room.",
    tour: false,
  },
  {
    id: "primary",
    name: "Primary Bedroom",
    x: 0, y: 16, w: 14, d: 12,
    tone: "sleeping",
    doors: [
      { wall: "N", atFt: 4, widthFt: 3 },
      { wall: "S", atFt: 2, widthFt: 5, open: true }, // garden doors
    ],
    windows: [{ wall: "S", atFt: 9, widthFt: 4 }],
    fixtures: ["wardrobe-west"],
    features: ["Doors straight onto the garden", "Built-in wardrobes, full west wall", "Room for a king bed and two desks"],
    tourNote:
      "The garden doors are the point of this room: coffee outside in summer without going through the house. Wardrobes take the whole west wall, so the floor stays clear.",
    tour: true,
  },
  {
    id: "bathroom",
    name: "Bathroom",
    x: 14, y: 16, w: 7, d: 7,
    tone: "wet",
    doors: [{ wall: "N", atFt: 2, widthFt: 2.5 }],
    windows: [],
    fixtures: ["bath-west"],
    features: ["Roll-top bath", "Separate shower", "Heated floor and a skylight"],
    tourNote:
      "No window, by design — a skylight does the daylight and the heated floor does the mornings. The bath is cast iron and stays with the house.",
    tour: true,
  },
  {
    id: "laundry",
    name: "Laundry",
    x: 14, y: 23, w: 7, d: 5,
    tone: "wet",
    doors: [{ wall: "N", atFt: 2, widthFt: 2.5 }],
    windows: [{ wall: "S", atFt: 2, widthFt: 3 }],
    fixtures: ["washer-north"],
    labelDyFt: 0.8,
    features: ["Washer and dryer side by side", "Sink for muddy boots", "Door through from the bathroom"],
    tourNote: "Reached through the bathroom, so wet things never cross a bedroom.",
    tour: false,
  },
  {
    id: "bed-two",
    name: "Bedroom Two",
    x: 21, y: 16, w: 9, d: 12,
    tone: "sleeping",
    doors: [{ wall: "N", atFt: 3, widthFt: 3 }],
    windows: [{ wall: "S", atFt: 2, widthFt: 5 }],
    fixtures: [],
    features: ["South-facing over the garden", "Fits a double bed", "Deep window seat"],
    tourNote:
      "The sunniest bedroom. The window seat is built in, deep enough to sit in with a book, and it lifts for storage.",
    tour: true,
  },
  {
    id: "bed-three",
    name: "Bedroom Three",
    x: 30, y: 16, w: 10, d: 12,
    tone: "sleeping",
    doors: [{ wall: "N", atFt: 3, widthFt: 3 }],
    windows: [{ wall: "S", atFt: 2.5, widthFt: 6 }],
    fixtures: [],
    features: ["Widest garden outlook", "Used as a studio today", "Two double sockets per wall"],
    tourNote:
      "Currently a painting studio, which tells you about the light. As a bedroom it takes a double and a wardrobe without squeezing either.",
    tour: true,
  },
];

/* Derived facts — computed, never retyped. */

export const roomArea = (room: Room) => room.w * room.d;
export const totalAreaSqFt = rooms.reduce((sum, room) => sum + roomArea(room), 0);
export const bedrooms = rooms.filter((r) => r.tone === "sleeping");
export const bathrooms = rooms.filter((r) => r.id === "bathroom");
export const tourRooms = rooms.filter((r) => r.tour);
export const roomById = (id: string): Room => {
  const room = rooms.find((r) => r.id === id);
  if (!room) throw new Error(`unknown room ${id}`);
  return room;
};

/** "15'-0\" × 12'-0\"" for a room, from its geometry. */
export const roomDims = (room: Room) => `${feet(room.w)} × ${feet(room.d)}`;

/* ------------------------------------------------------------------ */
/* The viewing itself                                                  */
/* ------------------------------------------------------------------ */

export const viewingSteps = [
  {
    title: "Arrive by 11:20",
    body: "Park on the drive — Elena will be at the front door with the fact sheet printed.",
  },
  {
    title: "Walk it in plan order",
    body: "The tour follows the plan on this page: living room first, garden bedrooms last, so the light makes sense.",
  },
  {
    title: "Twenty minutes to wander",
    body: "After the guided pass, the house is yours for twenty minutes. Open cupboards. Run the taps. That is what the slot is for.",
  },
  {
    title: "Questions on the drive",
    body: "Offers, timelines, the boiler, the lane — Elena answers what she can on the spot and follows up the same day on the rest.",
  },
];

export const finePrint = [
  "Sample template data: Keystone Estates, 14 Wrenwood Lane, Omar Haddad and Elena Marsh are fictional, and no real viewing is booked.",
  "Measurements are computed from the plan data in this template and are approximate, as all room measurements are.",
];
