import * as React from 'react'
import { Helmet } from 'react-helmet'

interface Props {
  title: string | null
  description: string | null
  url: string | null
  image: string | null
}

const Title = (props: Props) => (
  <Helmet>
    {/* Primary Meta Tags */}
    <title>{props.title ? `${props.title} - typ` : 'typ'}</title>

    <meta name='title' content={props.title ? `${props.title} - typ` : 'typ'} />
    <meta name='description' content='Bot Lists. Reinvented' />

    {/* Open Graph / Facebook */}
    <meta property='og:type' content='website' />
    <meta property='og:url' content={props.url || 'https://typapp.co'} />
    <meta property='og:title' content={props.title ? `${props.title} - typ` : 'typ'} />
    <meta property='og:description' content={props.description || 'Bot Lists. Reinvented'} />
    <meta property='og:image' content={props.image} />

    {/* Twitter */}
    <meta property='twitter:card' content='summary_large_image' />
    <meta property='twitter:url' content={props.url || 'https://typapp.co'} />
    <meta property='twitter:title' content={props.title ? `${props.title} - typ` : 'typ'} />
    <meta property='twitter:description' content={props.description || 'Bot Lists. Reinvented'} />
    <meta property='twitter:image' content={props.image} />
  </Helmet>
)

export default Title
