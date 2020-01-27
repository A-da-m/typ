import * as React from 'react'

import axios from 'axios'
import { markdown } from 'markdown'
import Title from '../components/title'
import { connect } from 'react-redux'

class Bot extends React.Component {
  props: any
  state: any

  constructor (props: any) {
    super(props)
    const id = props?.match?.params?.id
    this.state = {
      bot: null
    }

    axios.get(`/v1/bots/${id}`)
      .then(result => {
        this.setState({
          bot: result.data?.bot,
          owner: result.data?.owner
        })
      })
      .catch(error => console.error(error))
    this.onApproveClick = this.onApproveClick.bind(this)
    this.onRemoveClick = this.onRemoveClick.bind(this)
  }

  onApproveClick () {
    if (!this.state?.bot) return
    const bot = this.state.bot
    bot.approved = true
    axios.post(`/v1/admin/bots/${this.state.bot.id}/approved`)
      .then(() => this.setState({ bot }))
      .catch(error => console.error(error))
  }

  onRemoveClick () {
    if (!this.state?.bot) return
    const bot = this.state.bot
    bot.approved = false
    axios.post(`/v1/admin/bots/${this.state.bot.id}/remove`)
      .then(() => this.setState({ bot }))
      .catch(error => console.error(error))
  }

  render () {
    return (
      <>
        <Title title={this.state.bot ? this.state.bot.username : 'Loading'} />
        <div className='column' style={{ paddingLeft: 0, overflowY: 'scroll' }}>
          {this.state.bot ?
            <>
              <div style={{ overflowY: 'scroll' }}>
                <div className='image banner has-background-primary' style={{ objectFit: 'cover', border: 0, backgroundImage: `url("${this.state.bot.banner}")`, backgroundSize: 'cover' }} />
                <div className='bot-body' style={{ marginBottom: '150px' }}>
                  <img className='image is-256x256' src={`https://cdn.discordapp.com/avatars/${this.state.bot.id}/${this.state.bot.avatar}.png?size=256`} style={{ borderRadius: '12px', boxShadow: '0 2px 9px 4px rgba(27,27,27,0.19)', backgroundColor: '#0a0a0a' }} />
                  <h1 className='has-text-white is-size-1' style={{ fontWeight: 900 }}>{this.state.bot.username}</h1>
                  <h3 className='is-size-4 has-text-grey'>{this.state.bot.description.short}</h3>
                  <p style={{ marginTop: '10px' }}>
                    <a href={this.state.bot.invite}>
                      <span className='tag is-link'>Invite</span>
                    </a>
                    {this.state.owner ? <a href={`/user/${this.state.bot.ownerID}`}><span className='tag is-black' style={{ marginLeft: 5 }}>{this.state.owner.username}#{this.state.owner.discriminator}</span></a> : <></>}
                    {this.props.isAuthenticated && (this.state.bot.ownerID === this.props.user.id) ? <a href={`/bot/${this.state.bot.id}/manage`}><span className='tag is-warning' style={{ marginLeft: 5 }}>Manage</span></a> : <></>}
                    {this.props.isAuthenticated && this.props.user?.admin > 0 ? (this.state.bot.approved ? <a onClick={this.onRemoveClick}><span className='tag is-danger' style={{ marginLeft: 5 }}>Remove</span></a> : <a onClick={this.onApproveClick}><span className='tag is-success' style={{ marginLeft: 5 }}>Approve</span></a>) : <></>}
                  </p>
                  <br />
                  <p className='has-text-grey-lighter' dangerouslySetInnerHTML={{ __html: markdown.toHTML(this.state.bot.description.long) }}></p>
                </div>
              </div>
            </>
          : <></>}
        </div>
      </>
    )
  }
}

const mapStateToProps = (state: any) => ({
  user: state.auth.user || null,
  isAuthenticated: state.auth.isAuthenticated || false,
  loading: state.auth.loading || false
})

export default connect(mapStateToProps)(Bot)
