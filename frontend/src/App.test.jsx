import { act, render, screen, within } from '@testing-library/react'
import { vi } from 'vitest'
import App from './App.jsx'

describe('App', () => {
  it('renders the countdown heading and intro text', () => {
    render(<App />)

    expect(screen.getByText('The Final Countdown')).toBeTruthy()
    expect(screen.getByText(/31\. desember 2028/i)).toBeTruthy()
    expect(
      screen.getByText(/Tiden som gjenstår til alle fagrutiner i Infotrygd skal være utfaset/i),
    ).toBeTruthy()
  })

  it('renders the closed Infotrygd routines', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /tipp topp! allerede stengt/i })).toBeTruthy()
    expect(screen.getByText('Tidsbegrenset uføre')).toBeTruthy()
    expect(screen.getByText('Rehabiliteringspenger')).toBeTruthy()
    expect(screen.getByText('Attføring')).toBeTruthy()
    expect(screen.getByText('Pensjonsrutinen')).toBeTruthy()
    expect(screen.getByText('Regnskapsrutinen')).toBeTruthy()
    expect(screen.getByText('Enslig forsørger')).toBeTruthy()
    expect(screen.getByText('Kontantstøtte')).toBeTruthy()
  })

  it('renders routines that are next to be closed', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /hvem blir den neste\?/i }),
    ).toBeTruthy()
    const nextRoutines = screen.getByRole('region', { name: /hvem blir den neste\?/i })
    expect(within(nextRoutines).getByText('Barnetrygd')).toBeTruthy()
    expect(within(nextRoutines).getByText('Medlemskap')).toBeTruthy()
    expect(within(nextRoutines).getByText('Supplerende stønad')).toBeTruthy()
    expect(within(nextRoutines).getByText('Kun 1 løpende sak og 16 åpne saker igjen')).toBeTruthy()
    expect(within(nextRoutines).getByText('0 løpende saker og 70 åpne saker')).toBeTruthy()
    expect(within(nextRoutines).getByText('0 løpende saker og 83 åpne saker')).toBeTruthy()
  })

  it('renders Foreldrepenger and Sykdom i familien among the closed routines', () => {
    render(<App />)

    const closedRoutines = screen.getByRole('region', { name: /tipp topp! allerede stengt/i })
    expect(within(closedRoutines).getByText('Foreldrepenger')).toBeTruthy()
    expect(
      within(closedRoutines).getByText('Skrudd av i 4.kvartal av Team Foreldrepenger'),
    ).toBeTruthy()
    expect(within(closedRoutines).getByText('Sykdom i familien')).toBeTruthy()
    expect(
      within(closedRoutines).getByText('Skrudd av i 4.kvartal av Team Sykdom i familien'),
    ).toBeTruthy()
  })

  it('renders routines where closure has not started', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /her er det møe ærbe, færr!/i }),
    ).toBeTruthy()
    expect(screen.getByText('Forsikringsordninger')).toBeTruthy()
    expect(screen.getByText('Gravferdsstønad og båretransport')).toBeTruthy()
    expect(screen.getByText('Grunn- og hjelpestønad')).toBeTruthy()
    expect(screen.getByText('Gjenlevende')).toBeTruthy()
    expect(screen.getByText('Helsetjenester')).toBeTruthy()
    expect(screen.getByText('Hjelpemidler')).toBeTruthy()
  })

  it('renders the Team BAKS achievement', () => {
    render(<App />)

    expect(
      screen.getByText('Tid siden Team BAKS skrudde av kontantstøtte (1. september 2026):'),
    ).toBeTruthy()
    expect(
      screen.getByRole('timer', {
        name: /dager, \d+ timer og \d+ minutter siden kontantstøtte ble skrudd av/i,
      }),
    ).toBeTruthy()
  })

  it('renders and updates the closure clocks while keeping the main clock counting down', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-15T07:22:00+02:00'))

    try {
      render(<App />)

      const mainCountdown = screen.getByRole('timer', { name: /sekunder igjen/i })
      expect(mainCountdown).toBeTruthy()
      expect(
        screen.getByRole('heading', { name: 'Tid siden Foreldrepenger ble stengt' }),
      ).toBeTruthy()
      expect(screen.getByText('14. oktober 2026 kl. 07:27')).toBeTruthy()
      expect(
        screen.getByRole('timer', {
          name: '0 dager, 23 timer, 55 minutter og 0 sekunder siden Foreldrepenger ble stengt',
        }),
      ).toBeTruthy()
      expect(
        screen.getByRole('heading', { name: 'Tid siden Sykdom i familien ble stengt' }),
      ).toBeTruthy()
      expect(screen.getByText('15. oktober 2026 kl. 07:22')).toBeTruthy()
      expect(
        screen.getByRole('timer', {
          name: '0 dager, 0 timer, 0 minutter og 0 sekunder siden Sykdom i familien ble stengt',
        }),
      ).toBeTruthy()

      act(() => {
        vi.advanceTimersByTime(1_000)
      })

      expect(
        screen.getByRole('timer', {
          name: '0 dager, 0 timer, 0 minutter og 1 sekunder siden Sykdom i familien ble stengt',
        }),
      ).toBeTruthy()
    } finally {
      vi.useRealTimers()
    }
  })
})
