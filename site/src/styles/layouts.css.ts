import { style, globalStyle } from '@vanilla-extract/css'
import { vars } from './theme.css'

export const container = style({
  width: '100%',
  maxWidth: '1200px',
  marginInline: 'auto',
  paddingInline: 'var(--size-4)',
  '@media': {
    '(min-width: 768px)': {
      paddingInline: 'var(--size-6)',
    },
    '(min-width: 1024px)': {
      paddingInline: 'var(--size-8)',
    },
  },
})

export const containerNarrow = style({
  width: '100%',
  maxWidth: '800px',
  marginInline: 'auto',
  paddingInline: 'var(--size-4)',
  '@media': {
    '(min-width: 768px)': {
      paddingInline: 'var(--size-6)',
    },
  },
})

export const containerWide = style({
  width: '100%',
  maxWidth: '1440px',
  marginInline: 'auto',
  paddingInline: 'var(--size-4)',
  '@media': {
    '(min-width: 768px)': {
      paddingInline: 'var(--size-6)',
    },
    '(min-width: 1024px)': {
      paddingInline: 'var(--size-8)',
    },
  },
})

export const section = style({
  paddingBlock: 'var(--size-8)',
  '@media': {
    '(min-width: 768px)': {
      paddingBlock: 'var(--size-10)',
    },
  },
})

export const sectionAlt = style([section, {
  backgroundColor: vars.color.bgAlt,
}])

export const grid2 = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 'var(--size-5)',
  '@media': {
    '(min-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 'var(--size-7)',
    },
  },
})

export const grid3 = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 'var(--size-5)',
  '@media': {
    '(min-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '(min-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--size-6)',
    },
  },
})

export const flexCenter = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const flexBetween = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const stack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--size-4)',
})

export const stackLg = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--size-7)',
})
