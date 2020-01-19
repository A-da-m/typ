import * as React from 'react'
import axios from 'axios'

class Manage extends React.Component {
  props: any
  state: any

  constructor (props: any) {
    super(props)
    const id = props?.match?.params?.id
    this.state = {
      id: id,
      long: null,
      short: null,
      invite: null,
      errors: [],
      submitted: false,
      bot: null
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onSave = this.onSave.bind(this)
    axios.get(`/v1/bots/${id}`)
      .then(result => {
        this.setState({
          bot: result.data?.bot,
          long: result.data?.bot?.description?.long,
          short: result.data?.bot?.description?.short,
          invite: result?.data?.bot?.invite
        })
      })
      .catch(error => console.error(error))
  }

  onSubmit () {
    this.setState({ errors: [] })
    if (!this.state.id) return this.setState({ errors: this.state.errors.push('id') })
    if (!this.state.long) return this.setState({ errors: this.state.errors.push('long') })
    if (!this.state.short) return this.setState({ errors: this.state.errors.push('short') })
    axios.post(`/v1/bots/${this.state.id}`, { description: { long: this.state.long, short: this.state.short }, public: true, invite: this.state.invite || null })
      .then(result => {
        this.setState({
          long: null,
          short: null,
          invite: null,
          submitted: result.data
        })
      })
      .catch(error => console.error(error))
  }

  onSave () {
    this.setState({ errors: [] })
    if (!this.state.long) return this.setState({ errors: this.state.errors.push('long') })
    if (!this.state.short) return this.setState({ errors: this.state.errors.push('short') })
    axios.post(`/v1/bots/${this.state.id}`, { description: { long: this.state.long, short: this.state.short }, public: false, invite: this.state.invite || null })
      .then(result => {
        this.setState({
          long: null,
          short: null,
          invite: null,
          submitted: result.data
        })
      })
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
                  Manage Bot
                </h1>
                <h2 className='subtitle'>
                  Manage your bot, grow your bot.
                </h2>
              </div>
            </div>
          </section>
          <div style={{ marginBottom: '150px', padding: '5%', paddingTop: 30 }} className='columns'>
            <div className='column'>
              {this.state.submitted ? <div className='notification is-primary is-light'>Successfully edited: <strong>{this.state.submitted.username}#{this.state.submitted.discriminator}</strong></div> : <></>}

              <div className='field'>
                <label className='label has-text-white'>Short Description</label>
                <div className='control'>
                  <input className='input' type='text' value={this.state.short || ''} placeholder='Text' onChange={(event) => this.setState({ short: event.target.value })} />
                </div>
              </div>

              <div className='field'>
                <label className='label has-text-white'>Long Description</label>
                <div className='control'>
                  <textarea className='textarea' value={this.state.long || ''} placeholder='Text' onChange={(event) => this.setState({ long: event.target.value })}></textarea>
                </div>
              </div>

              <div className='field'>
                <label className='label has-text-white'>Invite</label>
                <div className='control'>
                  <input className='input' type='text' value={this.state.invite || ''} placeholder='Invite URL' onChange={(event) => this.setState({ invite: event.target.value })} />
                </div>
              </div>

              <div className='field is-grouped'>
                <div className='control'>
                  <button className='button is-primary is-medium' onClick={this.onSubmit}>Submit</button>
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

export default Manage
