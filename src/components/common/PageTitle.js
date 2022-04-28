import Head from 'next/head'

export default function PageTitle({ title }) {
  return (
    <Head>
      <title>{ title }</title>
      <link rel="icon" href="/static/images/favicon.ico" />
      <meta name="viewport" content="initial-scale=1, width=device-width" />
    </Head>
  )
}