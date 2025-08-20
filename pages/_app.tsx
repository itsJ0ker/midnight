import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'


export default function MyApp({ Component, pageProps }: AppProps) {
return (
<>
<Head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=Orbitron:wght@600;700;800&display=swap" rel="stylesheet" />
</Head>
<Component {...pageProps} />
</>
)
}