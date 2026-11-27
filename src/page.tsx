/**
 * The listing page (960px).
 *
 * It opens like a set of printed particulars — address, price, the facts
 * in a row — and then gives the page to the plan. Below the plan, the
 * tour walks the house room by room; every stop is generated from the
 * room list, and every stop carries the plan again with that one room
 * lit, so you always know where you are standing.
 */
import {
  Button,
  Column,
  Divider,
  Grid,
  Heading,
  List,
  ListItem,
  Page,
  Row,
  Section,
  Span,
  Text,
  token,
} from "@hyper-elements/react";
import {
  agent,
  bedrooms,
  house,
  roomArea,
  roomDims,
  tourRooms,
  usd,
  viewer,
  viewing,
} from "./data";
import { palette, viewingTheme, webFonts } from "./theme";
import { FloorPlan, PlanThumb, toneFill } from "./plan";
import { AgencyLine, FooterBlock, HouseFacts } from "./shared";

function ToneKey({ tone, label }: { tone: keyof typeof toneFill; label: string }) {
  return (
    <Row style={{ gap: 8, alignItems: "center" }} stackOnMobile={false}>
      <Column style={{ width: 14, height: 14, flex: "none", backgroundColor: toneFill[tone], border: { width: 1, style: "solid", color: palette.charcoal } }} />
      <Text style={{ fontSize: 12.5, color: token("colors.muted") }}>{label}</Text>
    </Row>
  );
}

export default function ListingPage() {
  return (
    <Page
      width={960}
      theme={viewingTheme}
      title={`${house.address}, ${house.town} — ${usd(house.priceCents)} · Keystone Estates`}
      description={`${house.address}, ${house.town}: a ${bedrooms.length}-bedroom detached house at ${usd(house.priceCents)}, with a full floor plan and a room-by-room tour. Viewings Saturday.`}
      lang="en"
      fonts={webFonts}
      style={{ gap: 0 }}
    >
      {/* Particulars header. */}
      <Section style={{ padding: [30, 40, 0], gap: 22, mobile: { padding: [24, 24, 0] } }}>
        <Row style={{ alignItems: "center" }}>
          <AgencyLine />
          <Column style={{ alignItems: "end", gap: 2 }}>
            <Text style={{ apply: ["factLabel"] }}>Asking price</Text>
            <Text style={{ fontFamily: token("fonts.heading"), fontSize: 26, fontWeight: 700, lineHeight: 1.1, color: palette.clay }}>
              {usd(house.priceCents)}
            </Text>
          </Column>
        </Row>
        <Divider />
        <Column style={{ gap: 12 }}>
          <Heading level={1} style={{ fontSize: 52, mobile: { fontSize: 36 } }}>
            {house.address}
          </Heading>
          <Text style={{ fontSize: 18, lineHeight: 1.6, color: palette.charcoalSoft, mobile: { fontSize: 16 } }}>
            {house.summary}
          </Text>
        </Column>
        <HouseFacts columns={4} />
        <Row style={{ gap: 24 }}>
          <Text style={{ fontSize: 13.5, color: token("colors.muted") }}>
            <Span style={{ fontWeight: 700, color: palette.charcoal }}>Plot</Span> · {house.plot}
          </Text>
          <Text style={{ fontSize: 13.5, color: token("colors.muted") }}>
            <Span style={{ fontWeight: 700, color: palette.charcoal }}>Parking</Span> · {house.parking}
          </Text>
          <Text style={{ fontSize: 13.5, color: token("colors.muted") }}>
            <Span style={{ fontWeight: 700, color: palette.charcoal }}>Heating</Span> · {house.heating}
          </Text>
        </Row>
      </Section>

      {/* The plan. */}
      <Section style={{ padding: [30, 40, 0], mobile: { padding: [24, 24, 0] } }}>
        <Column style={{ apply: ["panel"], gap: 14 }}>
          <Row style={{ alignItems: "center" }}>
            <Column style={{ gap: 4 }}>
              <Text style={{ apply: ["kicker"] }}>The plan</Text>
              <Heading level={2}>One floor, nine rooms, no corridors wasted</Heading>
            </Column>
            <Text style={{ apply: ["chip"], flex: "none" }}>Ground floor · only floor</Text>
          </Row>
          <Text style={{ fontSize: 15, lineHeight: 1.6, color: palette.charcoalSoft }}>
            Drawn from the measured room data — the same data that prints the fact sheet and orders the tour
            below. Walls are the heavy lines; a gap with a leaf and an arc is a door; three thin lines in an
            outer wall are a window.
          </Text>
          <FloorPlan width={820} hidden={{ mobile: true }} />
          <FloorPlan width={268} caption={false} hidden={{ desktop: true }} />
          <Grid columns={3} style={{ gap: 14 }}>
            <ToneKey tone="living" label="Living rooms" />
            <ToneKey tone="kitchen" label="Kitchen" />
            <ToneKey tone="sleeping" label="Bedrooms" />
            <ToneKey tone="wet" label="Bathroom & laundry" />
            <ToneKey tone="passage" label="Hall" />
          </Grid>
        </Column>
      </Section>

      {/* The tour. */}
      <Section style={{ padding: [36, 40, 0], gap: 8, mobile: { padding: [28, 24, 0] } }}>
        <Text style={{ apply: ["kicker"] }}>Room by room</Text>
        <Heading level={2}>Walk it before you visit</Heading>
        <Text style={{ fontSize: 15.5, lineHeight: 1.65, color: palette.charcoalSoft }}>
          The stops follow the order {agent.name.split(" ")[0]} will walk them on {viewing.dayName} — front door
          first, garden rooms last. The lit room in each small plan is the room you are reading about.
        </Text>
      </Section>
      <Section style={{ padding: [18, 40, 0], gap: 0, mobile: { padding: [14, 24, 0] } }}>
        {tourRooms.map((room, i) => (
          <Column key={room.id}>
            <Row style={{ gap: 28, alignItems: "start", padding: [22, 0] }}>
              {i % 2 === 1 ? <PlanThumb roomId={room.id} width={248} /> : null}
              <Column style={{ gap: 9 }}>
                <Text style={{ apply: ["kicker"] }}>
                  Stop {i + 1} · {roomDims(room)} · {roomArea(room)} sq ft
                </Text>
                <Heading level={3} style={{ fontSize: 22 }}>{room.name}</Heading>
                <Text style={{ fontSize: 15, lineHeight: 1.65, color: palette.charcoalSoft }}>{room.tourNote}</Text>
                <List style={{ gap: 5, fontSize: 14, lineHeight: 1.5, indent: 18 }}>
                  {room.features.map((feature) => (
                    <ListItem key={feature}>{feature}</ListItem>
                  ))}
                </List>
              </Column>
              {i % 2 === 0 ? <PlanThumb roomId={room.id} width={248} /> : null}
            </Row>
            {i < tourRooms.length - 1 ? <Divider /> : null}
          </Column>
        ))}
        <Text style={{ fontSize: 13.5, lineHeight: 1.6, color: token("colors.muted"), padding: [14, 0, 0] }}>
          The hall and the laundry are on the plan and in the fact sheet&rsquo;s room table; they don&rsquo;t get
          tour stops, because nobody buys a house for its hall — even a good one.
        </Text>
      </Section>

      {/* The invitation. */}
      <Section
        tokens={{ colors: { background: palette.clay, foreground: palette.white } }}
        style={{ backgroundColor: palette.clay, padding: [36, 40], gap: 18, mobile: { padding: [28, 24] } }}
      >
        <Text style={{ apply: ["kicker"], color: palette.clayPale }}>Next viewing</Text>
        <Heading level={2} style={{ fontSize: 32, color: palette.white, mobile: { fontSize: 26 } }}>
          {viewer.fullName} — {viewing.dayName}, {viewing.timeShort}
        </Heading>
        <Text style={{ fontSize: 16, lineHeight: 1.65, color: palette.clayPale }}>
          One slot is held for {viewer.firstName} on {viewing.dateLabel} at {viewing.time} ({viewing.duration.toLowerCase()}),
          reference {viewing.reference}. Further slots open on the hour; call the office and we will fit you in.
        </Text>
        <Row style={{ gap: 14, alignItems: "center" }}>
          <Button href={viewing.confirmHref} style={{ flex: "none", backgroundColor: palette.white, color: palette.clayDark }}>
            Your viewing details
          </Button>
          <Text style={{ fontSize: 14.5, color: palette.white }}>
            {agent.name} · {agent.mobile}
          </Text>
        </Row>
      </Section>

      <Section style={{ padding: [28, 40, 36], mobile: { padding: [24, 24, 28] } }}>
        <FooterBlock />
      </Section>
    </Page>
  );
}
