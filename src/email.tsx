/**
 * The confirmation email (600px).
 *
 * Its shape is a letter, not a ticket: the appointment is the headline —
 * the day and the hour set in Fraunces at the top — then a short ledger
 * of what was booked, then the house in miniature. The MiniPlan is the
 * same room geometry as the listing page's plan, redrawn in boxes
 * because an inbox cannot draw Svg.
 */
import {
  Button,
  Column,
  Divider,
  Email,
  Grid,
  Heading,
  Link,
  List,
  ListItem,
  Row,
  Section,
  Span,
  Text,
  token,
} from "@hyper-elements/react";
import { agency, agent, house, roomDims, rooms, usd, viewer, viewing, viewingSteps } from "./data";
import { palette, viewingTheme, webFonts } from "./theme";
import { MiniPlan } from "./plan";
import { AgencyLine, AgentBlock, FooterBlock } from "./shared";

function LedgerRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Row style={{ gap: 16, alignItems: "start" }}>
      <Text style={{ apply: ["factLabel"], width: 110, flex: "none", padding: [3, 0, 0] }}>{label}</Text>
      <Column style={{ gap: 1 }}>
        <Text style={{ fontSize: 15.5, fontWeight: 600, lineHeight: 1.4 }}>{value}</Text>
        {sub ? <Text style={{ fontSize: 13, lineHeight: 1.45, color: token("colors.muted") }}>{sub}</Text> : null}
      </Column>
    </Row>
  );
}

export default function ViewingEmail() {
  return (
    <Email
      width={600}
      theme={viewingTheme}
      title={`Your viewing of ${house.address} — ${viewing.dateLabel}, ${viewing.time}`}
      previewText={`${viewer.firstName}, your viewing of ${house.address} is booked for ${viewing.dayName} at ${viewing.timeShort}. Ref ${viewing.reference}.`}
      lang="en"
      fonts={webFonts}
      style={{ gap: 0 }}
    >
      <Section style={{ padding: [30, 40, 0], gap: 26, mobile: { padding: [24, 24, 0] } }}>
        <Row style={{ alignItems: "center" }}>
          <AgencyLine />
          <Text style={{ apply: ["chip"], flex: "none" }}>Ref {viewing.reference}</Text>
        </Row>

        <Column style={{ gap: 12 }}>
          <Text style={{ apply: ["kicker"] }}>Your viewing is booked</Text>
          <Heading level={1}>
            {viewing.dayName}, {viewing.timeShort} — {house.address}
          </Heading>
          <Text style={{ fontSize: 16.5, lineHeight: 1.65 }}>
            Dear {viewer.firstName}, this confirms your viewing of {house.address}, {house.town}, on{" "}
            {viewing.dateLabel} at {viewing.time}. The slot is {viewing.duration.toLowerCase()} and it is yours
            alone — no one else will be walked through while you are there.
          </Text>
        </Column>

        <Column style={{ apply: ["panel"], gap: 13 }}>
          <LedgerRow label="Property" value={`${house.address}, ${house.town}`} sub={`${house.tenure} · built ${house.built} · ${house.plot}`} />
          <Divider />
          <LedgerRow label="Asking price" value={usd(house.priceCents)} sub="The printed fact sheet will be waiting for you at the door." />
          <Divider />
          <LedgerRow label="Viewing" value={`${viewing.dateLabel}, ${viewing.time}`} sub={`Arrive by ${viewing.arriveBy} · ${viewing.duration} · ${viewer.party}`}  />
          <Divider />
          <LedgerRow label="Your agent" value={agent.name} sub={agent.note} />
        </Column>

        <Column style={{ gap: 12 }}>
          <Text style={{ apply: ["kicker"] }}>The house, in miniature</Text>
          <Text style={{ fontSize: 15, lineHeight: 1.6, color: palette.charcoalSoft }}>
            Every room, to scale, exactly as the agent will walk it with you. The full plan — doors, windows and
            all — is on the listing page.
          </Text>
          <MiniPlan />
          <Grid columns={2} style={{ gap: 20, rowGap: 6 }}>
            {rooms.map((room) => (
              <Text key={room.id} style={{ fontSize: 12.5, lineHeight: 1.5, color: token("colors.muted") }}>
                <Span style={{ fontWeight: 700, color: palette.charcoal }}>{room.name}</Span> · {roomDims(room)}
              </Text>
            ))}
          </Grid>
        </Column>

        <Column style={{ gap: 12 }}>
          <Text style={{ apply: ["kicker"] }}>How the viewing runs</Text>
          <List type="number" style={{ gap: 10, fontSize: 15, lineHeight: 1.55, indent: 22 }}>
            {viewingSteps.map((step) => (
              <ListItem key={step.title}>
                <Span style={{ fontWeight: 700 }}>{step.title}. </Span>
                {step.body}
              </ListItem>
            ))}
          </List>
        </Column>

        <Row style={{ gap: 14 }}>
          <Button href={viewing.confirmHref} style={{ flex: "none", width: 280 }}>
            Confirm or move this viewing
          </Button>
          <Button href={`https://${agency.site}`} variant="outline" style={{ flex: "none", width: 200 }}>
            See the full listing
          </Button>
        </Row>

        <Divider />

        <AgentBlock />

        <Column style={{ gap: 4 }}>
          <Text style={{ fontSize: 14.5, lineHeight: 1.6 }}>
            Anything before Saturday? Reply to this email or call the office on{" "}
            <Link href={agency.phoneHref}>{agency.phone}</Link>.
          </Text>
          <Text style={{ fontSize: 14.5, color: token("colors.muted") }}>— {agency.name}</Text>
        </Column>

        <Divider />
        <Column style={{ padding: [0, 0, 30] }}>
          <FooterBlock />
        </Column>
      </Section>
    </Email>
  );
}
