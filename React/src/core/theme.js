import { DefaultTheme } from 'react-native-paper'

export const theme = {
  ...DefaultTheme,

  colors: {
    ...DefaultTheme.colors,
    text: '#000000',
    grayedText: '#747474',
    textSecondary: '#fff',
    heading: '#333333',
    description: '#666666',
    caption: '#888888',
    primary: '#48A6A7',
    secondary: '#9ACBD0',
    error: '#F13A59',
    surface: '#F2EFE7',
    background: '#181818',
    expense: '#E57373',
    income: '#81C784',
    primaryDimmed: '#264242'
  },

  fonts: {
    ...DefaultTheme.fonts,
    light: { fontFamily: 'Quicksand-Light', fontWeight: '300' },
    regular: { fontFamily: 'Quicksand-Regular', fontWeight: '400' },
    medium: { fontFamily: 'Quicksand-Medium', fontWeight: '500' }, 
    bold: { fontFamily: 'Quicksand-Bold', fontWeight: '700' },
  },
  
}
