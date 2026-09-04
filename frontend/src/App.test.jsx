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
})
