import { globalStyle, style } from '@vanilla-extract/css'
import { vars } from './theme.css'

// Fraunces variable axis presets
export const fraunces = {
  hero: {
    fontFamily: vars.font.serif,
    fontWeight: '800',
    fontVariationSettings: '"WONK" 1, "SOFT" 50',
  },
  section: {
    fontFamily: vars.font.serif,
    fontWeight: '700',
    fontVariationSettings: '"WONK" 0, "SOFT" 100',
  },
  subsection: {
    fontFamily: vars.font.serif,
    fontWeight: '600',
    fontVariationSettings: '"WONK" 0, "SOFT" 100',
  },
  pullQuote: {
    fontFamily: vars.font.serif,
    fontWeight: '500',
    fontStyle: 'italic' as const,
    fontVariationSettings: '"WONK" 1, "SOFT" 50',
  },
  stat: {
    fontFamily: vars.font.serif,
    fontWeight: '900',
    fontVariationSettings: '"WONK" 0, "SOFT" 0',
  },
} as const

// Type scale classes using CSS clamp() for fluid sizing
export const textDisplay = style({
  fontFamily: vars.font.serif,
  fontWeight: '800',
  fontVariationSettings: '"WONK" 1, "SOFT" 50',
  fontSize: 'clamp(2.5rem, 5vw + 1rem, 4rem)',
  lineHeight: '1.1',
  color: vars.color.textPrimary,
})

export const textH1 = style({
  fontFamily: vars.font.serif,
  fontWeight: '700',
  fontVariationSettings: '"WONK" 0, "SOFT" 100',
  fontSize: 'clamp(2rem, 3vw + 0.5rem, 3rem)',
  lineHeight: '1.15',
  color: vars.color.textPrimary,
})

export const textH2 = style({
  fontFamily: vars.font.serif,
  fontWeight: '700',
  fontVariationSettings: '"WONK" 0, "SOFT" 100',
  fontSize: 'clamp(1.625rem, 2vw + 0.5rem, 2.25rem)',
  lineHeight: '1.2',
  color: vars.color.textPrimary,
})

export const textH3 = style({
  fontFamily: vars.font.serif,
  fontWeight: '600',
  fontVariationSettings: '"WONK" 0, "SOFT" 100',
  fontSize: 'clamp(1.3125rem, 1.5vw + 0.5rem, 1.75rem)',
  lineHeight: '1.25',
  color: vars.color.textPrimary,
})

export const textH4 = style({
  fontFamily: vars.font.sans,
  fontWeight: '600',
  fontSize: 'clamp(1.125rem, 1vw + 0.5rem, 1.375rem)',
  lineHeight: '1.3',
  color: vars.color.textPrimary,
})

export const textBody = style({
  fontFamily: vars.font.sans,
  fontWeight: '400',
  fontSize: 'clamp(1rem, 0.5vw + 0.75rem, 1.125rem)',
  lineHeight: '1.6',
  color: vars.color.textBody,
})

export const textBodyLg = style({
  fontFamily: vars.font.sans,
  fontWeight: '400',
  fontSize: 'clamp(1.125rem, 0.5vw + 0.875rem, 1.25rem)',
  lineHeight: '1.6',
  color: vars.color.textBody,
})

export const textSmall = style({
  fontFamily: vars.font.sans,
  fontWeight: '400',
  fontSize: '0.875rem',
  lineHeight: '1.5',
  color: vars.color.textMuted,
})

export const textCaption = style({
  fontFamily: vars.font.sans,
  fontWeight: '400',
  fontSize: '0.75rem',
  lineHeight: '1.4',
  color: vars.color.textMuted,
})

export const textOverline = style({
  fontFamily: vars.font.sans,
  fontWeight: '500',
  fontSize: 'clamp(0.75rem, 0.25vw + 0.625rem, 0.8125rem)',
  lineHeight: '1.2',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.textMuted,
})
