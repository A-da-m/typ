import * as React from 'react'
import { Helmet } from 'react-helmet'

interface Props {
  title: String
}

const Title = (props: Props) => (
  <Helmet>
    <title>{`${props.title} - typ`}</title>
  </Helmet>
)

export default Title
