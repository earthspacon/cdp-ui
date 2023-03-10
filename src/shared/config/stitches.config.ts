import type * as Stitches from '@stitches/react';
import { createStitches } from '@stitches/react';

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  utils: {
    bc: stitchCSSProp('backgroundColor'),
    br: stitchCSSProp('borderRadius'),
    c: stitchCSSProp('color'),
    d: stitchCSSProp('display'),
    fd: stitchCSSProp('flexDirection'),
    fw: stitchCSSProp('fontWeight'),
    fs: stitchCSSProp('fontSize'),
    ff: stitchCSSProp('fontFamily'),
    jc: stitchCSSProp('justifyContent'),
    ai: stitchCSSProp('alignItems'),
    m: stitchCSSProp('margin'),
    mb: stitchCSSProp('marginBottom'),
    ml: stitchCSSProp('marginLeft'),
    mr: stitchCSSProp('marginRight'),
    mt: stitchCSSProp('marginTop'),
    p: stitchCSSProp('padding'),
    pb: stitchCSSProp('paddingBottom'),
    pl: stitchCSSProp('paddingLeft'),
    pr: stitchCSSProp('paddingRight'),
    pt: stitchCSSProp('paddingTop'),
    w: stitchCSSProp('width'),
    h: stitchCSSProp('height'),
    size: stitchCSSProp('width', 'height'),
    maxW: stitchCSSProp('maxWidth'),
    maxH: stitchCSSProp('maxHeight'),
    minW: stitchCSSProp('minWidth'),
    minH: stitchCSSProp('minHeight'),
    ta: stitchCSSProp('textAlign'),
  },
});

export type StitchesCSS = Stitches.CSS<typeof config>;

function stitchCSSProp(...props: (keyof Stitches.CSSProperties)[]) {
  return (value: Stitches.PropertyValue<(typeof props)[number]>) =>
    props.reduce(
      (acc, prop) => ({
        ...acc,
        [prop]: value,
      }),
      {} as Stitches.CSSProperties,
    );
}
