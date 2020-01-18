import * as React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCertificate, faServer, faHeart } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

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

        console.log(result.data)
        // const bots = result.data.filter((bot: any) => bot.featured)
        this.setState({
          bot: result.data?.bot,
          owner: result.data?.owner
        })
      })
      .catch(error => console.error(error))
  }

  render () {
    return (
      <div className='column' style={{ paddingLeft: 0, overflowY: 'scroll' }}>
        {this.state.bot ?
          <>
            <div style={{ overflowY: 'scroll' }}>
              <img className='image banner has-background-primary' src={this.state.bot.banner} style={{ objectFit: 'cover', border: 0 }} />
              <div className='bot-body' style={{ marginBottom: '150px' }}>
                <img className='image is-256x256' src={`https://cdn.discordapp.com/avatars/${this.state.bot.id}/${this.state.bot.avatar}.png?size=256`} style={{ borderRadius: '12px', boxShadow: '0 2px 9px 4px rgba(27,27,27,0.19)', backgroundColor: '#0a0a0a' }} />
                <h1 className='has-text-white is-size-1' style={{ fontWeight: 900 }}>{this.state.bot.username}</h1>
                <h3 className='is-size-4 has-text-grey'>{this.state.bot.description.short}</h3>
                <p style={{ marginTop: '10px' }}><a href={this.state.bot.invite}><span className='tag is-black'>Invite</span></a>{this.state.owner ? <span className='tag is-black' style={{ marginLeft: 5 }}>{this.state.owner.username}#{this.state.bot.discriminator}</span> : <></>}</p>
                <br />
                <p className='has-text-grey-lighter'>{this.state.bot.description.long}</p>
              </div>
            </div>
          </>
        : <></>}
      </div>
    )
  }
}

export default Bot
