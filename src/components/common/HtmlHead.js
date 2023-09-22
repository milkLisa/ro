import Head from 'next/head'

export default function HtmlHead({ title }) {
  return (
    <Head>
      <title>{ title }</title>
      <link rel="manifest" href="/manifest.json" />
      <link rel="icon" type="image/x-icon" href="/static/icons/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/static/icons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/static/icons/favicon-16x16.png" />
      <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
      <meta name="theme-color" content="#FFFFFF" />
      
      { /* PWA settings for iOS device */ }
      <link rel="apple-touch-icon" href="/static/icons/icon-36x36.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/static/icons/icon-72x72.png"/>
      <link rel="apple-touch-icon" sizes="144x144" href="/static/icons/ios/icon-144x144.png"/>
      <link rel="apple-touch-icon" sizes="192x192" href="/static/icons/ios/icon-192x192.png"/>
      <link rel="apple-touch-icon" sizes="512x512" href="/static/icons/ios/icon-512x512.png"/>
                       
      <link rel="apple-touch-startup-image" href="/static/icons/ios/iphone5_splash.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" />
      <link rel="apple-touch-startup-image" href="/static/icons/ios/iphone6_splash.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" />
      <link rel="apple-touch-startup-image" href="/static/icons/ios/iphoneplus_splash.png" media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)" />
      <link rel="apple-touch-startup-image" href="/static/icons/ios/iphonex_splash.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" />
      <link rel="apple-touch-startup-image" href="/static/icons/ios/iphonexr_splash.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" />
      <link rel="apple-touch-startup-image" href="/static/icons/ios/iphonexsmax_splash.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" />
      <link rel="apple-touch-startup-image" href="/static/icons/ios/ipad_splash.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" />
      <link rel="apple-touch-startup-image" href="/static/icons/ios/ipadpro1_splash.png" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)" />
      <link rel="apple-touch-startup-image" href="/static/icons/ios/ipadpro3_splash.png" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)" />
      <link rel="apple-touch-startup-image" href="/static/icons/ios/ipadpro2_splash.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" />

      <meta name="apple-mobile-web-app-title" content="RO MVP Timer" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="description" content="Ragnarok Online MVP Timer" />
    </Head>
  )
}