import Head from 'next/head'

export default function PageTitle({title}) {
  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/static/images/favicon.ico" />
    </Head>
  )
}