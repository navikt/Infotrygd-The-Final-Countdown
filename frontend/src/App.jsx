import React, { useEffect, useState } from "react";
import { BodyLong, BodyShort, Box, HGrid, Heading, VStack } from "@navikt/ds-react";
import { CircleFillIcon } from "@navikt/aksel-icons";

const TARGET_TIME = new Date("2028-12-31T23:59:59+01:00").getTime();
const SECOND = 1_000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function getTimeLeft() {
  const difference = Math.max(0, TARGET_TIME - Date.now());

  return {
    days: Math.floor(difference / DAY),
    hours: Math.floor((difference % DAY) / HOUR),
    minutes: Math.floor((difference % HOUR) / MINUTE),
    seconds: Math.floor((difference % MINUTE) / SECOND),
    complete: difference === 0,
  };
}

function TimeUnit({ value, label }) {
  return (
    <div className="time-unit">
      <span className="time-value">{String(value).padStart(2, "0")}</span>
      <span className="time-label">{label}</span>
    </div>
  );
}

function StatusCircle({ status }) {
  return (
    <CircleFillIcon
      className={`status-circle status-circle--${status}`}
      aria-hidden="true"
    />
  );
}

export default function App() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, SECOND);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <main>
      <VStack className="dashboard" gap={{ xs: "space-6", md: "space-8" }}>
        <section aria-labelledby="countdown-title">
          <Box
            className="module countdown-card"
            background="surface-default"
            padding={{ xs: "space-6", md: "space-8" }}
            borderRadius="large"
          >
            <VStack gap="space-4">
              <div className="eyebrow">The Final Countdown</div>
              <Heading id="countdown-title" level="1" size="xlarge">
                31. desember 2028
              </Heading>
              <BodyLong className="intro">
                Tiden som gjenstår til alle fagrutiner i Infotrygd skal være utfaset
                og slått av
              </BodyLong>

              {timeLeft.complete ? (
                <Heading className="complete-message" level="2" size="large">
                  Dagen er her!
                </Heading>
              ) : (
                <div
                  className="countdown"
                  role="timer"
                  aria-live="off"
                  aria-label={`${timeLeft.days} dager, ${timeLeft.hours} timer, ${timeLeft.minutes} minutter og ${timeLeft.seconds} sekunder igjen`}
                >
                  <TimeUnit value={timeLeft.days} label="dager" />
                  <span className="separator" aria-hidden="true">:</span>
                  <TimeUnit value={timeLeft.hours} label="timer" />
                  <span className="separator" aria-hidden="true">:</span>
                  <TimeUnit value={timeLeft.minutes} label="minutter" />
                  <span className="separator" aria-hidden="true">:</span>
                  <TimeUnit value={timeLeft.seconds} label="sekunder" />
                </div>
              )}

              <div className="progress-line" aria-hidden="true">
                <span />
              </div>
              <BodyLong className="date-note" size="small">
                Søndag 31.12.2028 · kl. 23:59:59
              </BodyLong>
            </VStack>
          </Box>
        </section>

        <section aria-label="Status for utfasing">
          <VStack gap="space-6">
            <HGrid gap="space-6" columns={{ xs: 1, md: 2, lg: 3 }}>
        <section aria-labelledby="closed-routines-title">
          <Box
            className="module routines-card"
            background="surface-subtle"
            padding={{ xs: "space-6", md: "space-8" }}
            borderRadius="large"
          >
            <VStack gap="space-6">
              <VStack className="routines-header" gap="space-2">
                <Heading id="closed-routines-title" level="2" size="medium">
                  Tipp topp! Allerede stengt
                </Heading>
              </VStack>

              <ul className="routine-list">
                <li>
                  <StatusCircle status="success" />
                  <BodyShort weight="semibold">
                    Tidsbegrenset uføre, rehabiliteringspenger og attføring
                  </BodyShort>
                  <BodyShort size="small">
                    Skrudd av i 4. kvartal 2022 av Team Historisk.
                  </BodyShort>
                </li>
                <li>
                  <StatusCircle status="success" />
                  <BodyShort weight="semibold">Pensjonsrutinen</BodyShort>
                  <BodyShort size="small">
                    Skrudd av i 1. kvartal 2023 av Team Historisk.
                  </BodyShort>
                </li>
                <li>
                  <StatusCircle status="success" />
                  <BodyShort weight="semibold">Regnskapsrutinen</BodyShort>
                  <BodyShort size="small">
                    Skrudd av i 4. kvartal 2023 av Team Historisk.
                  </BodyShort>
                </li>
                <li>
                  <StatusCircle status="success" />
                  <BodyShort weight="semibold">Enslig forsørger</BodyShort>
                  <BodyShort size="small">
                    Skrudd av i 4. kvartal 2025 av Team EFterlatte.
                  </BodyShort>
                </li>
                <li>
                  <StatusCircle status="success" />
                  <BodyShort weight="semibold">Kontantstøtte</BodyShort>
                  <BodyShort size="small">
                    Skrudd av i 3. kvartal 2026 av Team BAKS.
                  </BodyShort>
                </li>
              </ul>
            </VStack>
          </Box>
        </section>

        <section aria-labelledby="next-routine-title">
          <Box
            className="module next-routine-card"
            background="surface-subtle"
            padding={{ xs: "space-6", md: "space-8" }}
            borderRadius="large"
          >
            <VStack gap="space-6">
              <div className="routines-header">
                <Heading id="next-routine-title" level="2" size="medium">
                  Hvem blir den neste?
                </Heading>
              </div>
              <ul className="active-routine-list">
                <li>
                  <StatusCircle status="almost-ready" />
                  <BodyShort weight="semibold">Barnetrygd</BodyShort>
                  <BodyShort size="small">
                    Kun 3 løpende saker og 29 åpne saker igjen.
                  </BodyShort>
                </li>
                <li>
                  <StatusCircle status="almost-ready" />
                  <BodyShort weight="semibold">Foreldrepenger</BodyShort>
                  <BodyShort size="small">
                    0 løpende saker og 18 åpne saker.
                  </BodyShort>
                </li>
                <li>
                  <StatusCircle status="almost-ready" />
                  <BodyShort weight="semibold">Sykdom i familien</BodyShort>
                  <BodyShort size="small">
                    0 løpende saker og 18 åpne saker igjen.
                  </BodyShort>
                </li>
                <li>
                  <StatusCircle status="almost-ready" />
                  <BodyShort weight="semibold">Medlemskap</BodyShort>
                  <BodyShort size="small">
                    0 løpende saker og 77 åpne saker.
                  </BodyShort>
                </li>
                <li>
                  <StatusCircle status="almost-ready" />
                  <BodyShort weight="semibold">Supplerende stønad</BodyShort>
                  <BodyShort size="small">
                    0 løpende saker og 98 åpne saker.
                  </BodyShort>
                </li>
              </ul>
            </VStack>
          </Box>
        </section>

        <section aria-labelledby="idle-routines-title">
          <Box
            className="module idle-routines-card"
            background="surface-subtle"
            padding={{ xs: "space-6", md: "space-8" }}
            borderRadius="large"
          >
            <VStack gap="space-6">
              <div className="routines-header">
                <Heading id="idle-routines-title" level="2" size="medium">
                  Her er det møe ærbe, færr!
                </Heading>
                <BodyShort size="small">
                  (Rettskriving av Ulefossnormen)
                </BodyShort>
              </div>
              <ul className="idle-routine-list">
                <li className="in-progress">
                  <StatusCircle status="warning" />
                  <BodyShort weight="semibold">Sykepenger</BodyShort>
                  <BodyShort size="small">
                    Utfasing pågår, fremdeles mye igjen.
                  </BodyShort>
                </li>
                <li className="in-progress">
                  <StatusCircle status="warning" />
                  <BodyShort weight="semibold">Yrkesskade</BodyShort>
                  <BodyShort size="small">
                    Utfasing pågår, fremdeles noe igjen.
                  </BodyShort>
                </li>
                <li>
                  <StatusCircle status="danger" />
                  <BodyShort weight="semibold">Forsikringsordninger</BodyShort>
                  <BodyShort size="small">
                    Ikke påbegynt!
                  </BodyShort>
                </li>
                <li>
                  <StatusCircle status="danger" />
                  <BodyShort weight="semibold">
                    Gravferdsstønad og båretransport
                  </BodyShort>
                  <BodyShort size="small">
                    Ikke påbegynt!
                  </BodyShort>
                </li>
                <li>
                  <StatusCircle status="danger" />
                  <BodyShort weight="semibold">Grunn- og hjelpestønad</BodyShort>
                  <BodyShort size="small">
                    Ikke påbegynt!
                  </BodyShort>
                </li>
                <li>
                  <StatusCircle status="danger" />
                  <BodyShort weight="semibold">Gjenlevende</BodyShort>
                  <BodyShort size="small">
                    Påbegynt, men stoppet!
                  </BodyShort>
                </li>
                <li>
                  <StatusCircle status="danger" />
                  <BodyShort weight="semibold">Helsetjenester</BodyShort>
                  <BodyShort size="small">
                    Påbegynt, men stoppet!
                  </BodyShort>
                </li>
                <li>
                  <StatusCircle status="danger" />
                  <BodyShort weight="semibold">Hjelpemidler</BodyShort>
                  <BodyShort size="small">
                     Påbegynt, men stoppet!
                  </BodyShort>
                </li>
              </ul>
            </VStack>
          </Box>
        </section>
            </HGrid>
          </VStack>
        </section>
      </VStack>
    </main>
  );
}
