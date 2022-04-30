import Head from 'next/head'

export default function HtmlHead({ title }) {
  return (
    <Head>
      <title>{ title }</title>
      <link rel="manifest" href="/manifest.json" />
      <link rel="shortcut icon" href="/static/icons/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/static/icons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/static/icons/favicon-16x16.png" />
      <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
    </Head>
  )
}