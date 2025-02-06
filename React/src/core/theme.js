import { DefaultTheme } from 'react-native-paper'

export const theme = {
  ...DefaultTheme,

  colors: {
    ...DefaultTheme.colors,
    text: '#000000',
    heading: '#333333', // Darker color for headings
    description: '#666666', // Softer gray for descriptions
    caption: '#888888', // Lighter color for captions or small text
    primary: '#48A6A7',
    secondary: '#9ACBD0',
    error: '#f13a59',
    surface: '#F2EFE7',
  },

  fonts: {
    ...DefaultTheme.fonts, // Preserve default variants
    light: { fontFamily: 'Quicksand-Light', fontWeight: 'normal' },
    regular: { fontFamily: 'Quicksand-Regular', fontWeight: 'normal' },
    medium: { fontFamily: 'Quicksand-Medium', fontWeight: 'normal' },
    bold: { fontFamily: 'Quicksand-Bold', fontWeight: 'normal' },
  },
}
