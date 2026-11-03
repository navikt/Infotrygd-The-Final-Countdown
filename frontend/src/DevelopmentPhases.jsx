import { useState } from "react";
import {
  BodyLong, BodyShort, Box, Button, Heading, HStack, Tag, Timeline, VStack,
} from "@navikt/ds-react";
import { getPeriods, greenStarts, items, phaseDefinitions } from "./timeline.js";
import "./development-phases.css";

const dateFormatter = new Intl.DateTimeFormat("nb-NO", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});
const startDate = new Date(2011, 0, 1);
const endDate = new Date(2028, 11, 31);

export default function DevelopmentPhases() {
  const [showGreen, setShowGreen] = useState(false);
  const visibleItems = showGreen ? items : items.filter((item) => !greenStarts[item]);

  return (
    <main className="development-phases">
      <VStack className="phases-page" gap="space-24">
        <HStack as="nav" aria-label="Sidenavigasjon" justify="space-between" align="center" gap="space-16" wrap>
          <Button as="a" role="link" href="#" variant="tertiary" size="small">
            Tilbake til forsiden
          </Button>
          <Tag variant="moderate" data-color="neutral" size="small">Kun lesing</Tag>
        </HStack>
        <Box className="phases-hero" padding={{ xs: "space-24", md: "space-48" }} borderRadius="16">
          <HStack justify="space-between" align="center" gap="space-32" wrap>
            <VStack gap="space-16">
              <BodyShort size="small" className="phases-eyebrow">Ytelser og områder · 2011–2028</BodyShort>
              <Heading level="1" size="xlarge" tabIndex={-1}>Utfasingen i overblikk.</Heading>
              <BodyLong>
                Hele tidslinjen. Ett sted.
                Se periodene og de registrerte datoene for hvert område.
              </BodyLong>
            </VStack>
            <HStack as="dl" gap="space-32" className="phases-stats" wrap>
              <div><dt>Ytelser og områder</dt><dd>{items.length}</dd></div>
              <div><dt>Registrerte datoer</dt><dd>{Object.keys(greenStarts).length}</dd></div>
              <div><dt>År i oversikten</dt><dd>18</dd></div>
            </HStack>
          </HStack>
        </Box>
        <Box className="phases-card" background="default" borderRadius="16">
          <Box padding={{ xs: "space-16", md: "space-24" }}>
            <VStack gap="space-16">
              <HStack justify="space-between" align="center" gap="space-16" wrap>
                <VStack gap="space-4">
                  <Heading level="2" size="medium">Ytelser og områder</Heading>
                  <BodyShort size="small">Perioder og datoer fra 2011 til 2028</BodyShort>
                </VStack>
                <Button
                  variant="secondary"
                  size="small"
                  aria-expanded={showGreen}
                  aria-controls="benefit-timeline"
                  onClick={() => setShowGreen((visible) => !visible)}
                >
                  {showGreen ? "Skjul" : "Vis"} områder med grønt ({Object.keys(greenStarts).length})
                </Button>
              </HStack>
              <BodyShort size="small" role="status">
                Viser {visibleItems.length} av {items.length} områder.
                {!showGreen && " Områder med grønt er skjult."}
              </BodyShort>
              <ul className="phases-legend" aria-label="Fargemarkeringer">
                {Object.entries(phaseDefinitions).map(([color, definition]) => (
                  <li key={color}>
                    <span className="phases-swatch" data-phase={color} aria-hidden="true" />
                    <VStack gap="space-4">
                      <BodyShort size="small" weight="semibold">
                        {color[0].toUpperCase() + color.slice(1)}
                      </BodyShort>
                      <BodyShort size="small">{definition}</BodyShort>
                    </VStack>
                  </li>
                ))}
              </ul>
              <BodyShort size="small" id="timeline-help">
                Velg et fargebånd for å se detaljer.
                Grønt viser at rutinen er skrudd av i Infotrygd.
                På smale skjermer kan tidslinjen rulles vannrett.
              </BodyShort>
            </VStack>
          </Box>
          <div
            id="benefit-timeline"
            className="phases-timeline-scroll"
            role="region"
            aria-label="Tidslinje for ytelser og områder"
            aria-describedby="timeline-help"
            tabIndex={0}
          >
            <Timeline startDate={startDate} endDate={endDate} className="phases-timeline">
              {visibleItems.map((item) => (
                <Timeline.Row
                  key={item}
                  label={
                    <VStack gap="space-0">
                      <BodyShort size="small" weight="semibold">{item}</BodyShort>
                      {greenStarts[item] && (
                        <BodyShort as="span" size="small" className="phases-benefit-date">
                          Skrudd av {greenStarts[item]}
                        </BodyShort>
                      )}
                    </VStack>
                  }
                >
                  {getPeriods(item).map((period) => (
                    <Timeline.Period
                      key={`${period.start}-${period.color}`}
                      start={period.startDate}
                      end={period.endDate}
                      data-phase={period.color}
                      data-color={period.color === "grønn" ? "success" : "neutral"}
                      statusLabel={`${item}: ${phaseDefinitions[period.color]}${period.date ? `, fra ${period.date}` : ""}`}
                      title={`${item}: ${phaseDefinitions[period.color]}${period.date ? ` fra ${period.date}` : ""}`}
                    >
                      <VStack gap="space-8" className="phases-period-details">
                        <Heading level="3" size="small">{item}</Heading>
                        <BodyShort size="small">{phaseDefinitions[period.color]}</BodyShort>
                        {period.date && <BodyShort size="small">Skrudd av: {period.date}</BodyShort>}
                        <BodyShort size="small">
                          Vises fra {dateFormatter.format(period.startDate)} til {dateFormatter.format(period.endDate)}.
                        </BodyShort>
                      </VStack>
                    </Timeline.Period>
                  ))}
                </Timeline.Row>
              ))}
            </Timeline>
          </div>
          <Box className="phases-note" padding={{ xs: "space-16", md: "space-24" }}>
            <BodyShort size="small">
              Fargebåndene viser registrerte perioder.
              Rader uten oppgitt dato er beholdt uten ny grønn markering.
            </BodyShort>
          </Box>
        </Box>
        <BodyShort size="small">
          Utformet med komponenter fra Navs designsystem Aksel. Dataene kan ikke endres på denne siden.
        </BodyShort>
      </VStack>
    </main>
  );
}
