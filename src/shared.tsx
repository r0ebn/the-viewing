/**
 * Small pieces shared by more than one output: the agency's nameplate,
 * the house's headline facts (all computed from src/data.ts), the agent
 * block and the footer line. Deliberately plain — the personality of
 * this kit lives in the plan, not in chrome.
 */
import { Column, Grid, Row, Text, token } from "@hyper-elements/react";
import { agency, agent, bathrooms, bedrooms, house, totalAreaSqFt, usd } from "./data";
import { palette } from "./theme";

/** KEYSTONE ESTATES, set like the sign over the office door. */
export function AgencyLine({ light = false }: { light?: boolean }) {
  return (
    <Column style={{ gap: 2 }}>
      <Text
        style={{
          fontFamily: token("fonts.heading"),
          fontSize: 19,
          fontWeight: 700,
          letterSpacing: 2.6,
          lineHeight: 1.1,
          color: light ? palette.sand : palette.charcoal,
        }}
      >
        KEYSTONE ESTATES
      </Text>
      <Text style={{ fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", lineHeight: 1.3, color: light ? palette.clayPale : palette.clay }}>
        {agency.strapline}
      </Text>
    </Column>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <Column style={{ gap: 3 }}>
      <Text style={{ apply: ["factLabel"] }}>{label}</Text>
      <Text style={{ fontSize: 16.5, fontWeight: 600, lineHeight: 1.3 }}>{value}</Text>
    </Column>
  );
}

/** Price, rooms and area — every number derived from the room data. */
export function HouseFacts({ columns = 4 }: { columns?: number }) {
  return (
    <Grid columns={columns} style={{ gap: 20 }}>
      <Fact label="Asking price" value={usd(house.priceCents)} />
      <Fact label="Bedrooms" value={`${bedrooms.length}`} />
      <Fact label="Bathrooms" value={`${bathrooms.length} + laundry`} />
      <Fact label="Room area" value={`${totalAreaSqFt.toLocaleString("en-US")} sq ft`} />
    </Grid>
  );
}

/** Who is holding the keys on Saturday. */
export function AgentBlock() {
  return (
    <Row style={{ gap: 16, alignItems: "center" }}>
      <Column
        style={{
          width: 46,
          height: 46,
          flex: "none",
          borderRadius: 999,
          backgroundColor: palette.clay,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontFamily: token("fonts.heading"), fontSize: 17, fontWeight: 700, color: palette.white, width: 46, textAlign: "center", padding: [11, 0, 0] }}>EM</Text>
      </Column>
      <Column style={{ gap: 1 }}>
        <Text style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.35 }}>
          {agent.name} · {agent.mobile}
        </Text>
        <Text style={{ fontSize: 13.5, lineHeight: 1.45, color: token("colors.muted") }}>{agent.role}</Text>
      </Column>
    </Row>
  );
}

/** The last line of any output: where the office is, and that this is a sample. */
export function FooterBlock({ light = false }: { light?: boolean }) {
  const main = light ? palette.sand : palette.charcoal;
  const sub = light ? palette.clayPale : token("colors.muted");
  return (
    <Column style={{ gap: 3 }}>
      <Text style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.5, color: main }}>
        {agency.name} · {agency.office}
      </Text>
      <Text style={{ fontSize: 12.5, lineHeight: 1.55, color: sub }}>
        {agency.phone} · {agency.email} · {agency.site}
      </Text>
      <Text style={{ fontSize: 12, lineHeight: 1.55, color: sub }}>
        A template with invented data — the agency, the house and the people are fictional.
      </Text>
    </Column>
  );
}
