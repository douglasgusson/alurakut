import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { AlurakutStyles } from '../src/lib/AlurakutCommons';

const GlobalStyle = createGlobalStyle`
  /* Reset CSS (Necolas Reset CSS <3) */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: sans-serif;
    background-color: #D9E6F6;
  }

  #__next {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    background-color: #efefff;
    opacity: 1;
    background: 
      linear-gradient(135deg, #feeaff55 25%, transparent 25%) -10px 0/ 20px 20px, 
      linear-gradient(225deg, #feeaff 25%, transparent 25%) -10px 0/ 20px 20px, 
      linear-gradient(315deg, #feeaff55 25%, transparent 25%) 0px 0/ 20px 20px, 
      linear-gradient(45deg, #feeaff 25%, #ffffff 25%) 0px 0/ 20px 20px;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  ${AlurakutStyles}
`

const theme = {
  colors: {
    primary: '#0070f3',
  },
}

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
