/**
 * The printed fact sheet (A4, portrait, one page exactly).
 *
 * What an agent hands over at the door: the address and the price, the
 * headline facts, and then the room table — which is not typed copy.
 * Every row is a room from src/data.ts, its dimensions and area computed
 * from the same rectangle that draws the plan, so the sheet can never
 * disagree with the plan pinned up beside it.
 */
import {
  Column,
  Divider,
  Document,
  Heading,
  PageFooter,
  PageNumber,
  Row,
  Table,
  TableCell,
  TableRow,
  Text,
  token,
} from "@hyper-elements/react";
import {
  agent,
  finePrint,
  house,
  roomArea,
  roomDims,
  rooms,
  totalAreaSqFt,
  usd,
  viewer,
  viewing,
} from "./data";
import { palette, viewingTheme, webFonts } from "./theme";
import { AgencyLine, HouseFacts } from "./shared";
import { MiniPlan } from "./plan";

export default function FactSheet() {
  return (
    <Document
      size="A4"
      orientation="portrait"
      margin={[26, 38, 20, 38]}
      theme={viewingTheme}
      title={`Fact sheet — ${house.address}, ${house.town} · ${usd(house.priceCents)}`}
      lang="en"
      fonts={webFonts}
      style={{ fontSize: 12.5, lineHeight: 1.5, gap: 7 }}
    >
      {/* Heading: the office, the sheet's purpose. */}
      <Row style={{ alignItems: "center", justifyContent: "space-between", gap: 20 }}>
        <AgencyLine />
        <Text style={{ apply: ["kicker"] }}>Property fact sheet</Text>
      </Row>

      <Divider />

      {/* The house in one line, then its facts. */}
      <Row style={{ alignItems: "end", justifyContent: "space-between", gap: 20 }}>
        <Column style={{ gap: 2 }}>
          <Heading level={1} style={{ fontSize: 30, lineHeight: 1.1 }}>
            {house.address}
          </Heading>
          <Text style={{ fontSize: 13, color: token("colors.muted") }}>
            {house.town} · {house.tenure} · built {house.built}
          </Text>
        </Column>
        <Text style={{ fontFamily: token("fonts.heading"), fontSize: 26, fontWeight: 700, color: palette.clay, lineHeight: 1.1 }}>
          {usd(house.priceCents)}
        </Text>
      </Row>

      <HouseFacts columns={4} />

      <Text style={{ fontSize: 12, lineHeight: 1.55, color: palette.charcoalSoft }}>
        {house.plot} · {house.parking} · {house.heating}.
      </Text>

      <Divider />

      {/* The room table: one row per room in the data, in plan order. */}
      <Column style={{ gap: 6 }}>
        <Text style={{ apply: ["kicker"] }}>The rooms, as measured</Text>
        <Table style={{ cellPadding: [5, 6], rowBorder: { width: 1, style: "solid", color: token("colors.border") }, fontSize: 11.5 }}>
          <TableRow header>
            <TableCell style={{ width: 104 }}>Room</TableCell>
            <TableCell style={{ width: 102 }}>Dimensions</TableCell>
            <TableCell style={{ width: 70, textAlign: "right" }}>Area</TableCell>
            <TableCell>What is in it</TableCell>
          </TableRow>
          {rooms.map((room) => (
            <TableRow key={room.id}>
              <TableCell style={{ fontWeight: 600 }}>{room.name}</TableCell>
              <TableCell>{roomDims(room)}</TableCell>
              <TableCell style={{ textAlign: "right" }}>{roomArea(room)} sq ft</TableCell>
              <TableCell>{room.features.join(" · ")}</TableCell>
            </TableRow>
          ))}
          <TableRow footer>
            <TableCell style={{ fontWeight: 700 }}>Whole house</TableCell>
            <TableCell style={{ fontWeight: 700 }}>40'-0" × 28'-0"</TableCell>
            <TableCell style={{ textAlign: "right", fontWeight: 700 }}>{totalAreaSqFt.toLocaleString("en-US")} sq ft</TableCell>
            <TableCell style={{ fontWeight: 700 }}>Single storey; every room off the hall</TableCell>
          </TableRow>
        </Table>
        <Text style={{ fontSize: 10.5, lineHeight: 1.5, color: token("colors.muted") }}>
          Dimensions and areas are computed from the plan data and rounded as shown; they are a guide, not a
          survey.
        </Text>
      </Column>

      <Divider />

      {/* The plan in miniature — the same slices the email carries. */}
      <Column style={{ gap: 6 }}>
        <Text style={{ apply: ["kicker"] }}>The plan, in miniature</Text>
        <MiniPlan />
        <Text style={{ fontSize: 10.5, lineHeight: 1.5, color: token("colors.muted") }}>
          North at the top, garden at the bottom. The full measured plan is on the listing page.
        </Text>
      </Column>

      <Divider />

      {/* The viewing this sheet was printed for. */}
      <Row style={{ gap: 14, backgroundColor: palette.sand, borderRadius: 8, padding: [12, 16], alignItems: "center" }}>
        <Column style={{ gap: 2, flex: 1.5 }}>
          <Text style={{ apply: ["factLabel"] }}>This viewing</Text>
          <Text style={{ fontSize: 14.5, fontWeight: 700, lineHeight: 1.35 }}>
            {viewer.fullName} · {viewing.dateLabel}, {viewing.time}
          </Text>
          <Text style={{ fontSize: 11.5, lineHeight: 1.5, color: token("colors.muted") }}>
            Reference {viewing.reference} · arrive by {viewing.arriveBy} · slot lasts {viewing.duration.toLowerCase()}
          </Text>
        </Column>
        <Column style={{ gap: 2, alignItems: "end" }}>
          <Text style={{ apply: ["factLabel"] }}>Agent on the day</Text>
          <Text style={{ fontSize: 14.5, fontWeight: 700, lineHeight: 1.35 }}>{agent.name}</Text>
          <Text style={{ fontSize: 11.5, lineHeight: 1.5, color: token("colors.muted") }}>{agent.mobile}</Text>
        </Column>
      </Row>

      {/* Fine print. */}
      <Column style={{ gap: 3, padding: [6, 0, 0] }}>
        {finePrint.map((line) => (
          <Text key={line} style={{ fontSize: 9.5, lineHeight: 1.45, color: token("colors.muted") }}>
            {line}
          </Text>
        ))}
      </Column>

      <PageFooter style={{ padding: [7, 0, 0], border: { top: `1px solid ${palette.border}` } }}>
        <Row style={{ gap: 16 }}>
          <Text style={{ fontSize: 9.5, color: token("colors.muted") }}>
            Keystone Estates · 3 Market Square, Alderbridge · +1 (555) 210-4416 · viewings@keystoneestates.example
          </Text>
          <Text style={{ width: 110, textAlign: "right", fontSize: 9.5, color: token("colors.muted") }}>
            Page <PageNumber /> of <PageNumber total />
          </Text>
        </Row>
      </PageFooter>
    </Document>
  );
}
