import * as React from 'react'
import { Modal } from 'react-bulma-components'

class Loading extends React.Component {
  props: any

  render () {
    return (
      <Modal.Content>
        <div className='spinner-border mx-auto' role='status' aria-hidden='true' />
        <h4 className='font-weight-bold mt-2'>Loading...</h4>
        <p className='mb-5'>This shouldn't take long.</p>
      </Modal.Content>
    )
  }
}

export default Loading
