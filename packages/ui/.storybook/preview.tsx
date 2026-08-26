import type { Preview } from '@storybook/react-vite';
import { CssVarsProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { MemoryRouter } from 'react-router-dom';
import theme from '../src/theme/theme';

const preview: Preview = {
  decorators: [
    (Story) => (
      <CssVarsProvider theme={theme} defaultColorScheme="light">
        <CssBaseline />
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </CssVarsProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
