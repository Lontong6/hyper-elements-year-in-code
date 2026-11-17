/**
 * Year in Code — a year-in-review stats card for a fictional developer,
 * Sinta Maharani. One `<Canvas>` (1080 × 1350, the portrait size social
 * platforms crop best) rendered to PNG and SVG with
 * `@hyper-elements/react/image`.
 *
 * Everything on the card is computed from the data at the top of this file:
 * the hero numeral is the sum of the monthly commits, the bar chart is drawn
 * from the same array (the best month is found, not marked up by hand), and
 * the stat cards come from a second array. Change the numbers and the whole
 * card — total, chart, highlight — follows.
 */
import {
  Canvas,
  Column,
  component,
  defineTheme,
  Divider,
  Grid,
  Heading,
  prop,
  Rect,
  Row,
  Svg,
  Text,
  token,
} from "@hyper-elements/react";

/* ------------------------------------------------------------------ data */

const MONTHS = [
  { name: "Jan", commits: 62 },
  { name: "Feb", commits: 74 },
  { name: "Mar", commits: 91 },
  { name: "Apr", commits: 88 },
  { name: "May", commits: 104 },
  { name: "Jun", commits: 97 },
  { name: "Jul", commits: 112 },
  { name: "Aug", commits: 121 },
  { name: "Sep", commits: 108 },
  { name: "Oct", commits: 138 },
  { name: "Nov", commits: 119 },
  { name: "Dec", commits: 96 },
];

const totalCommits = MONTHS.reduce((sum, m) => sum + m.commits, 0);
const bestMonth = MONTHS.reduce((a, b) => (b.commits > a.commits ? b : a));

const STATS: Array<{ value: string; label: string; tone: "cream" | "gold" | "coral" }> = [
  { value: "214", label: "Pull requests merged", tone: "cream" },
  { value: "342", label: "Code reviews given", tone: "cream" },
  { value: "47 days", label: "Longest commit streak", tone: "gold" },
  { value: "61%", label: "Top language — TypeScript", tone: "coral" },
];

/* ----------------------------------------------------------------- theme */

const theme = defineTheme({
  colors: {
    background: "#22142e",
    foreground: "#f7f1e5",
    primary: "#e9b44c",
    primaryForeground: "#22142e",
    muted: "#b3a1c7",
    border: "#4a3466",
  },
  fonts: {
    body: "Inter, 'Helvetica Neue', Arial, sans-serif",
    heading: "Fraunces, Georgia, serif",
  },
  components: {
    Heading: {
      by: {
        level: {
          1: { fontSize: 66, fontWeight: 500, fontStyle: "italic", lineHeight: 1.1 },
        },
      },
    },
    Text: { lineHeight: 1.4 },
  },
  styles: {
    statCard: {
      backgroundColor: "#2c1b3e",
      borderRadius: 20,
      padding: [24, 28],
      gap: 6,
    },
    eyebrow: {
      color: token("colors.primary"),
      fontSize: 28,
      fontWeight: 700,
      letterSpacing: 6,
    },
  },
});

/* ------------------------------------------------------- custom component */

/**
 * One stat card: a big value over a muted label. The tone picks which theme
 * colour the value takes; the card shell is the theme's `statCard` style.
 */
const Stat = component({
  type: "wrapped.Stat",
  label: "Stat",
  props: {
    value: prop.text({ required: true }),
    label: prop.text({ required: true }),
    tone: prop.choice(["cream", "gold", "coral"], { default: "cream" }),
  },
  render(props) {
    const color =
      props.tone === "gold" ? "#e9b44c" : props.tone === "coral" ? "#ff7a59" : "#f7f1e5";
    return (
      <Column style={{ apply: ["statCard"] }}>
        <Text style={{ fontSize: 50, fontWeight: 800, lineHeight: 1.1, color }}>{props.value}</Text>
        <Text style={{ fontSize: 24, color: token("colors.muted") }}>{props.label}</Text>
      </Column>
    );
  },
});

/* ----------------------------------------------------------------- chart */

const CHART = { width: 936, height: 214, baseline: 206, maxBar: 190, barWidth: 46 };
const slot = CHART.width / MONTHS.length;
const barHeight = (commits: number) => Math.round((commits / bestMonth.commits) * CHART.maxBar);

function CommitChart() {
  return (
    <Svg width={CHART.width} height={CHART.height} viewBox={`0 0 ${CHART.width} ${CHART.height}`}>
      {MONTHS.map((m, i) => {
        const h = barHeight(m.commits);
        return (
          <Rect
            key={m.name}
            x={i * slot + (slot - CHART.barWidth) / 2}
            y={CHART.baseline - h}
            width={CHART.barWidth}
            height={h}
            rx={8}
            style={{ fill: m.name === bestMonth.name ? "#ff7a59" : "#8e7cc3" }}
          />
        );
      })}
      <Rect x={0} y={CHART.baseline} width={CHART.width} height={3} style={{ fill: "#4a3466" }} />
    </Svg>
  );
}

/* --------------------------------------------------------------- template */

export default function YearInCode() {
  return (
    <Canvas lang="en" theme={theme} width={1080} height={1350} title="Year in Code 2026 — Sinta Maharani">
      <Column style={{ padding: [56, 72], gap: 26 }}>
        {/* Header */}
        <Row stackOnMobile={false} style={{ gap: 16 }}>
          <Text style={{ apply: ["eyebrow"], flex: 1 }}>YEAR IN CODE</Text>
          <Column
            style={{
              flex: "none",
              padding: [8, 20],
              borderRadius: 999,
              border: { width: 2, style: "solid", color: token("colors.primary") },
            }}
          >
            <Text style={{ fontSize: 26, fontWeight: 800, color: token("colors.primary") }}>2026</Text>
          </Column>
        </Row>

        {/* Who */}
        <Column style={{ gap: 8 }}>
          <Heading level={1}>Sinta Maharani</Heading>
          <Text style={{ fontSize: 26, color: token("colors.muted") }}>
            @sinta.codes · full-stack developer · Jakarta
          </Text>
        </Column>

        {/* The one big number */}
        <Column style={{ gap: 4 }}>
          <Text style={{ fontSize: 24, fontWeight: 700, letterSpacing: 4, color: token("colors.muted") }}>
            COMMITS SHIPPED
          </Text>
          <Text style={{ fontSize: 196, fontWeight: 800, lineHeight: 1, color: token("colors.primary") }}>
            {totalCommits.toLocaleString("en-US")}
          </Text>
        </Column>

        {/* Chart */}
        <Column style={{ gap: 12 }}>
          <Row stackOnMobile={false} style={{ gap: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: 700, letterSpacing: 4, color: token("colors.muted"), flex: 1 }}>
              COMMITS BY MONTH
            </Text>
            <Column style={{ flex: "none", width: 260 }}>
              <Text style={{ fontSize: 24, fontWeight: 600, color: "#ff7a59", textAlign: "right" }}>
                Best · {bestMonth.name} — {bestMonth.commits}
              </Text>
            </Column>
          </Row>
          <CommitChart />
          <Row stackOnMobile={false} style={{ gap: 0 }}>
            {MONTHS.map((m) => (
              <Text
                key={m.name}
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: 22,
                  fontWeight: m.name === bestMonth.name ? 700 : 400,
                  color: m.name === bestMonth.name ? "#ff7a59" : token("colors.muted"),
                }}
              >
                {m.name[0]}
              </Text>
            ))}
          </Row>
        </Column>

        {/* Stat cards */}
        <Grid columns={2} style={{ gap: 24 }}>
          {STATS.map((s) => (
            <Stat key={s.label} value={s.value} label={s.label} tone={s.tone} />
          ))}
        </Grid>

        {/* Footer */}
        <Column style={{ gap: 16 }}>
          <Divider />
          <Row stackOnMobile={false} style={{ gap: 16 }}>
            <Text style={{ fontSize: 22, color: token("colors.muted"), flex: 1 }}>
              Built with Hyper Elements
            </Text>
            <Column style={{ flex: "none", width: 190 }}>
              <Text style={{ fontSize: 22, fontWeight: 700, color: token("colors.primary"), textAlign: "right" }}>
                #YearInCode
              </Text>
            </Column>
          </Row>
        </Column>
      </Column>
    </Canvas>
  );
}
