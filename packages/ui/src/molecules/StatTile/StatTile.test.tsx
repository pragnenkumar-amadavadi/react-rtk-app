import { screen } from '@testing-library/react'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import { renderWithTheme } from '../../tests/utils'
import StatTile from './StatTile.component'

describe('StatTile', () => {
  it('renders the label', () => {
    renderWithTheme(<StatTile label="Open candidates" value={42} icon={<PeopleAltOutlinedIcon />} />)
    expect(screen.getByText('Open candidates')).toBeInTheDocument()
  })

  it('renders the value', () => {
    renderWithTheme(<StatTile label="Open candidates" value={42} icon={<PeopleAltOutlinedIcon />} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('formats large values with thousands separators', () => {
    renderWithTheme(<StatTile label="Open candidates" value={1234} icon={<PeopleAltOutlinedIcon />} />)
    expect(screen.getByText('1,234')).toBeInTheDocument()
  })
})
