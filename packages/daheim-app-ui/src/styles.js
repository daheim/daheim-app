export class Padding {
  static xl = '75px'
  static l = '45px'
  static mPx = 23
  static m = `${Padding.mPx}px`
  static sPx = 7
  static s = `${Padding.sPx}px`
}

export class Fontsize {
  static xl = '43px'
  static l = '20px'
  static m = '15px'
}

export class Color {
  static facebook = '#7996CD'
  static lightBlue = '#83BACF'
  static blue = '#54A2AF'
  static yellow = '#F5C62E'
  static green = '#257A51'
  static lightGreen = '#5CB990'
  static darkRed = '#7B3655'
  static red = '#E61C78'
  static black = '#323232'
}

export class Layout {
  static widthPx = 780
  static width = `${Layout.widthPx}px`
  static paddingPx = Padding.sPx
  static innerWidthPx = 780 - Layout.paddingPx * 2
  static headerWidthPx = 1000
  static headerWidth = `${Layout.headerWidthPx}px`
  static topbarHeightPx = 60
  static topbarHeight = `${Layout.topbarHeightPx}px`
  static mobileBreakpointPx = 700
  static mobileBreakpoint = `${Layout.mobileBreakpointPx}px`
}