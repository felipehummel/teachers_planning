import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Schedule } from './Schedule'

describe('Schedule Component', () => {
  const defaultProps = {
    weeks: 1,
    setWeeks: vi.fn(),
    selectedDays: Array(7).fill(false),
    setSelectedDays: vi.fn(),
  }

  it('renders duration slider with correct initial value', () => {
    render(<Schedule {...defaultProps} />)

    expect(screen.getByText('1 semana')).toBeDefined()
    expect(screen.getByRole('slider')).toHaveValue('1')
  })

  it('displays months when weeks are more than 4', () => {
    render(<Schedule {...defaultProps} weeks={8} />)

    expect(screen.getByText('8 semanas')).toBeDefined()
    expect(screen.getByText('(2 meses)')).toBeDefined()
  })

  it('handles slider value changes', () => {
    render(<Schedule {...defaultProps} />)

    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '12' } })

    expect(defaultProps.setWeeks).toHaveBeenCalledWith(12)
  })

  it('toggles weekday selection when clicking on day buttons', () => {
    render(<Schedule {...defaultProps} />)

    const mondayButton = screen.getByText('Seg')
    fireEvent.click(mondayButton)

    expect(defaultProps.setSelectedDays).toHaveBeenCalledWith([
      false,
      true,
      false,
      false,
      false,
      false,
      false,
    ])
  })

  it('renders all weekdays', () => {
    render(<Schedule {...defaultProps} />)

    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    weekdays.forEach(day => {
      expect(screen.getByText(day)).toBeDefined()
    })
  })
})
