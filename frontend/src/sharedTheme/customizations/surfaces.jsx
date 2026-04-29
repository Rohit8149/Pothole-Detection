import { alpha } from '@mui/material/styles';
import { gray } from '../themePrimitives';

/* eslint-disable import/prefer-default-export */
export const surfacesCustomizations = {
  MuiAccordion: {
    defaultProps: {
      elevation: 0,
      disableGutters: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        padding: 4,
        overflow: 'clip',
        backgroundColor: (theme.vars || theme).palette.background.default,
        border: '1px solid',
        borderColor: (theme.vars || theme).palette.divider,
        ':before': {
          backgroundColor: 'transparent',
        },
        '&:not(:last-of-type)': {
          borderBottom: 'none',
        },
        '&:first-of-type': {
          borderTopLeftRadius: (theme.vars || theme).shape.borderRadius,
          borderTopRightRadius: (theme.vars || theme).shape.borderRadius,
        },
        '&:last-of-type': {
          borderBottomLeftRadius: (theme.vars || theme).shape.borderRadius,
          borderBottomRightRadius: (theme.vars || theme).shape.borderRadius,
        },
      }),
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: ({ theme }) => ({
        border: 'none',
        borderRadius: 8,
        '&:hover': { backgroundColor: gray[50] },
        '&:focus-visible': { backgroundColor: 'transparent' },
        ...(theme.applyStyles && theme.applyStyles('dark', {
          '&:hover': { backgroundColor: gray[800] },
        })),
      }),
    },
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: { mb: 20, border: 'none' },
    },
  },
  MuiPaper: {
    defaultProps: {
      elevation: 0,
    },
  },
MuiCard: {
  styleOverrides: {
    root: ({ theme }) => ({
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      backgroundColor: '#ffffff',
      borderRadius: theme.shape.borderRadius,
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },

      // Mobile spacing improvement
      [theme.breakpoints.down('sm')]: {
        padding: 16,
      },
    }),

    // Optional: outlined variant
    outlined: {
      border: '1px solid #e2e8f0',
      boxShadow: 'none',
      backgroundColor: '#ffffff',
      '&:hover': {
        transform: 'none',
        boxShadow: 'none',
      },
    },
  },
},

  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: 0,
        '&:last-child': { paddingBottom: 0 },
      },
    },
  },
  MuiCardHeader: {
    styleOverrides: {
      root: {
        padding: 0,
      },
    },
  },
  MuiCardActions: {
    styleOverrides: {
      root: {
        padding: 0,
      },
    },
  },
};
