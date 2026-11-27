/**
 * The "Just Listed" card (1080 × 1080).
 *
 * A board for a feed, not a poster for a wall: JUST LISTED in plain
 * capitals, the address in Fraunces, the plan underneath it — labelled,
 * because a plan people can read is the whole point of this listing —
 * and the price and the first viewing time along the bottom.
 */
import { Canvas, Column, Heading, Row, Text, token } from "@hyper-elements/react";
import { agency, bedrooms, house, totalAreaSqFt, usd, viewing } from "./data";
import { palette, viewingTheme } from "./theme";
import { FloorPlan } from "./plan";
import { AgencyLine } from "./shared";

export default function JustListedCard() {
  return (
    <Canvas
      width={1080}
      height={1080}
      theme={viewingTheme}
      title={`Just listed — ${house.address}, ${house.town}, ${usd(house.priceCents)}`}
      lang="en"
      style={{
        backgroundColor: palette.sand,
        color: palette.charcoal,
        padding: [56, 64],
        gap: 22,
        justifyContent: "space-between",
      }}
    >
      <Column style={{ gap: 20 }}>
        <Row style={{ alignItems: "center" }}>
          <AgencyLine />
          <Text
            style={{
              fontSize: 21,
              fontWeight: 700,
              letterSpacing: 4.5,
              color: palette.white,
              backgroundColor: palette.clay,
              padding: [10, 20],
              borderRadius: 999,
            }}
          >
            JUST LISTED
          </Text>
        </Row>
        <Column style={{ gap: 6 }}>
          <Heading level={1} style={{ fontSize: 76, lineHeight: 1.02 }}>
            {house.address}
          </Heading>
          <Text style={{ fontSize: 25, lineHeight: 1.35, color: palette.charcoalSoft }}>
            {house.town} · {bedrooms.length} bedrooms · {totalAreaSqFt.toLocaleString("en-US")} sq ft · {house.tenure.toLowerCase()}
          </Text>
        </Column>
      </Column>

      <FloorPlan width={952} />

      <Row style={{ gap: 20, alignItems: "end" }}>
        <Column style={{ gap: 2 }}>
          <Text style={{ apply: ["factLabel"] }}>Asking price</Text>
          <Text style={{ fontFamily: token("fonts.heading"), fontSize: 54, fontWeight: 700, lineHeight: 1.05, color: palette.clay }}>
            {usd(house.priceCents)}
          </Text>
        </Column>
        <Column style={{ gap: 2, alignItems: "end" }}>
          <Text style={{ apply: ["factLabel"] }}>First viewings</Text>
          <Text style={{ fontSize: 23, fontWeight: 700, lineHeight: 1.3, textAlign: "right" }}>
            {viewing.dayName} from {viewing.timeShort}
          </Text>
          <Text style={{ fontSize: 16, lineHeight: 1.4, color: token("colors.muted"), textAlign: "right" }}>
            {agency.site} · {agency.phone}
          </Text>
        </Column>
      </Row>
    </Canvas>
  );
}
