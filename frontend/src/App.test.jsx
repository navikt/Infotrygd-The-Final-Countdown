import { render, screen } from '@testing-library/react'
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

    expect(screen.getByRole('heading', { name: /rutiner som er stengt/i })).toBeTruthy()
    expect(screen.getByText(/tidsbegrenset uføre, rehabiliteringspenger og attføring/i)).toBeTruthy()
    expect(screen.getByText('Pensjonsrutinen')).toBeTruthy()
    expect(screen.getByText('Regnskapsrutinen')).toBeTruthy()
    expect(screen.getByText('Enslig forsørger')).toBeTruthy()
    expect(screen.getByText('Kontantstøtte')).toBeTruthy()
  })

  it('renders routines that are next to be closed', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /hvilken rutine kan vi slå av neste gang/i }),
    ).toBeTruthy()
    expect(screen.getByText('Barnetrygd')).toBeTruthy()
    expect(screen.getByText('Foreldrepenger')).toBeTruthy()
    expect(screen.getByText('Sykdom i familien')).toBeTruthy()
  })

  it('renders routines where closure has not started', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /rutiner hvor utfasing ikke er i gang/i }),
    ).toBeTruthy()
    expect(screen.getByText('Forsikringsordninger')).toBeTruthy()
    expect(screen.getByText('Gravferdsstønad og båretransport')).toBeTruthy()
    expect(screen.getByText('Grunn- og hjelpestønad')).toBeTruthy()
    expect(screen.getByText('Gjenlevende')).toBeTruthy()
    expect(screen.getByText('Helsetjenester')).toBeTruthy()
    expect(screen.getByText('Hjelpemidler')).toBeTruthy()
  })
})
