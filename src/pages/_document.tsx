import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="cs">
      <Head>
        <meta name='application-name' content='EVO App' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='EVO App' />
        <meta name='description' content='Vzdělávací platforma pro osobní rozvoj' />
        <meta name='format-detection' content='telephone=no' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='theme-color' content='#000000' />

        <link rel='apple-touch-icon' href='/images/icons/icon-192x192.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/images/icons/icon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/images/icons/icon-16x16.png' />
        <link rel='manifest' href='/manifest.json' />
        <link rel='shortcut icon' href='/favicon.ico' />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 