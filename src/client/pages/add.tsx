import * as React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCertificate, faServer, faHeart } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

class Add extends React.Component {
  props: any
  state: any

  constructor (props: any) {
    super(props)
    this.state = {
      id: null,
      long: null,
      short: null,
      invite: null,
      errors: []
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onSave = this.onSave.bind(this)
  }

  onSubmit () {
    console.log('Submitted')
    this.setState({ errors: [] })
    if (!this.state.id) return this.setState({ errors: this.state.errors.push('id') })
    if (!this.state.long) return this.setState({ errors: this.state.errors.push('long') })
    if (!this.state.short) return this.setState({ errors: this.state.errors.push('short') })
    axios.post(`/v1/bots/${this.state.id}`, { description: { long: this.state.long, short: this.state.short }, public: true })
      .then(result => console.log(result))
      .catch(error => console.error(error))
  }

  onSave () {
    this.setState({ errors: [] })
    if (!this.state.id) return this.setState({ errors: this.state.errors.push('id') })
    if (!this.state.long) return this.setState({ errors: this.state.errors.push('long') })
    if (!this.state.short) return this.setState({ errors: this.state.errors.push('short') })
    axios.post(`/v1/bots/${this.state.id}`, { description: { long: this.state.long, short: this.state.short }, public: false })
      .then(result => console.log(result))
      .catch(error => console.error(error))
  }

  render () {
    return (
      <div className='column' style={{ paddingLeft: 0, overflowY: 'scroll' }}>
        <div style={{ overflowY: 'scroll' }}>
          <section className='hero is-medium is-primary is-bold'>
            <div className='hero-body' style={{ paddingLeft: '5%', paddingRight: '5%', paddingTop: '8rem', paddingBottom: '8rem' }}>
              <div className='container'>
                <h1 className='title' style={{ fontWeight: 900 }}>
                  Add Bot
                </h1>
                <h2 className='subtitle'>
                  Add your bot, grow your bot.
                </h2>
              </div>
            </div>
          </section>
          <div style={{ marginBottom: '150px', padding: '5%', paddingTop: 30 }} className='columns'>
            <div className='column'>
              <div className='field'>
                <label className='label has-text-white'>Bot ID</label>
                <div className='control'>
                  <input className='input' type='text' placeholder='ID' onChange={(event) => this.setState({ id: event.target.value })} />
                </div>
              </div>

              <div className='field'>
                <label className='label has-text-white'>Short Description</label>
                <div className='control'>
                  <input className='input' type='text' placeholder='Text' onChange={(event) => this.setState({ short: event.target.value })} />
                </div>
              </div>

              <div className='field'>
                <label className='label has-text-white'>Long Description</label>
                <div className='control'>
                  <textarea className='textarea' placeholder='Text' onChange={(event) => this.setState({ long: event.target.value })}></textarea>
                </div>
              </div>

              <div className='field'>
                <div className='control'>
                  <label className='checkbox has-text-white'>
                    <input type='checkbox' style={{ marginRight: '5px' }} />
                    I agree to the <a href='#'>terms and conditions</a>
                  </label>
                </div>
              </div>

              <div className='field is-grouped'>
                <div className='control'>
                  <button className='button is-primary is-medium' onClick={this.onSubmit}>Submit</button>
                </div>
                <div className='control'>
                  <button className='button is-light is-medium' onClick={this.onSave}>Save as Draft</button>
                </div>
              </div>
            </div>
            <div className='column'>
              Unable to generate preview for reason: Coming Soon
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Add
