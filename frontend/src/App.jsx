import React, { useEffect, useState } from "react";
import { BodyLong, Heading } from "@navikt/ds-react";

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
      <div className="glow glow-one" aria-hidden="true" />
      <div className="glow glow-two" aria-hidden="true" />

      <section className="countdown-card" aria-labelledby="countdown-title">
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
            <span className="separator" aria-hidden="true">
              :
            </span>
            <TimeUnit value={timeLeft.hours} label="timer" />
            <span className="separator" aria-hidden="true">
              :
            </span>
            <TimeUnit value={timeLeft.minutes} label="minutter" />
            <span className="separator" aria-hidden="true">
              :
            </span>
            <TimeUnit value={timeLeft.seconds} label="sekunder" />
          </div>
        )}

        <div className="progress-line" aria-hidden="true">
          <span />
        </div>
        <BodyLong className="date-note" size="small">
          Søndag 31.12.2028 · kl. 23:59:59
        </BodyLong>
      </section>
    </main>
  );
}
