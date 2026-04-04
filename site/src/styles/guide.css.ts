import { style, globalStyle } from '@vanilla-extract/css'
import { vars } from './theme.css'

export const guideHero = style({
  textAlign: 'center',
  paddingBlock: 'var(--size-8)',
  paddingInline: 'var(--size-4)',
  backgroundColor: vars.color.bgAlt,
  '@media': {
    '(min-width: 768px)': {
      paddingBlock: 'var(--size-10)',
      paddingInline: 'var(--size-6)',
    },
  },
})

export const guideHeroInner = style({
  maxWidth: '700px',
  marginInline: 'auto',
})

export const guideOverline = style({
  fontFamily: vars.font.sans,
  fontWeight: '500',
  fontSize: 'clamp(0.75rem, 0.25vw + 0.625rem, 0.8125rem)',
  lineHeight: '1.2',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.teal500,
  marginBottom: 'var(--size-2)',
})

export const guideTitle = style({
  fontFamily: vars.font.serif,
  fontWeight: '700',
  fontVariationSettings: '"WONK" 0, "SOFT" 100',
  fontSize: 'clamp(1.625rem, 2vw + 0.5rem, 2.25rem)',
  lineHeight: '1.2',
  color: vars.color.textPrimary,
  marginBottom: 'var(--size-3)',
})

export const guideDescription = style({
  fontFamily: vars.font.sans,
  fontWeight: '400',
  fontSize: 'clamp(1rem, 0.5vw + 0.75rem, 1.125rem)',
  lineHeight: '1.6',
  color: vars.color.textBody,
  maxWidth: '600px',
  marginInline: 'auto',
})

export const guideBody = style({
  maxWidth: '1000px',
  marginInline: 'auto',
  paddingBlock: 'var(--size-8)',
  paddingInline: 'var(--size-4)',
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 'var(--size-7)',
  '@media': {
    '(min-width: 768px)': {
      gridTemplateColumns: '360px 1fr',
      gap: 'var(--size-8)',
      paddingBlock: 'var(--size-10)',
      paddingInline: 'var(--size-6)',
      alignItems: 'start',
    },
  },
})

export const guideCoverWrap = style({
  display: 'flex',
  justifyContent: 'center',
  '@media': {
    '(min-width: 768px)': {
      position: 'sticky',
      top: 'var(--size-8)',
    },
  },
})

export const guideCoverImage = style({
  width: '100%',
  maxWidth: '320px',
  height: 'auto',
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.lg,
})

export const guideContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--size-6)',
})

export const guideBenefitsWrap = style({})

globalStyle(`${guideBenefitsWrap} h2, ${guideBenefitsWrap} h3`, {
  fontFamily: vars.font.serif,
  fontWeight: '600',
  fontVariationSettings: '"WONK" 0, "SOFT" 100',
  fontSize: 'clamp(1.3125rem, 1.5vw + 0.5rem, 1.75rem)',
  lineHeight: '1.25',
  color: vars.color.textPrimary,
  marginBottom: 'var(--size-3)',
})

globalStyle(`${guideBenefitsWrap} p`, {
  fontFamily: vars.font.sans,
  fontSize: 'clamp(1rem, 0.5vw + 0.75rem, 1.125rem)',
  lineHeight: '1.6',
  color: vars.color.textBody,
  marginBottom: 'var(--size-3)',
})

globalStyle(`${guideBenefitsWrap} ul, ${guideBenefitsWrap} ol`, {
  fontFamily: vars.font.sans,
  fontSize: 'clamp(1rem, 0.5vw + 0.75rem, 1.125rem)',
  lineHeight: '1.6',
  color: vars.color.textBody,
  paddingLeft: 'var(--size-5)',
  marginBottom: 'var(--size-4)',
})

globalStyle(`${guideBenefitsWrap} li`, {
  marginBottom: 'var(--size-2)',
})

export const guideFormWrap = style({
  maxWidth: '480px',
})

export const guideBodyFull = style({
  maxWidth: '600px',
  marginInline: 'auto',
  paddingBlock: 'var(--size-8)',
  paddingInline: 'var(--size-4)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--size-6)',
  '@media': {
    '(min-width: 768px)': {
      paddingBlock: 'var(--size-10)',
    },
  },
})
