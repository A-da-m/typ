import * as React from 'react'
import { useHistory } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCertificate } from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux'
import axios from 'axios'

const Bot = ({ bot }: any) => {
  const history = useHistory()
  return (
    <div className='column is-full-mobile is-half-tablet is-half-desktop is-one-third-widescreen is-one-quarter-fullhd'>
      <div className='card' style={{ borderRadius: '12px', backgroundColor: '#171717' }} onClick={() => history.push(`/bot/${bot.id}`)}>
        {/* <img src='/images/Adam.png' width='160' style={{ height: '100%', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}/> */}
        <div className='card-content'>
          <div className='media' style={{ marginBottom: 0 }}>
            <div className='media-left'>
              <figure className='image is-96x96'>
                <img src={`https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.png?size=256`} alt='Placeholder image' style={{  borderRadius: '8px' }}/>
              </figure>
            </div>
            <div className='media-content' style={{ marginTop: 'auto', marginBottom: 'auto' }}>
              <p className='title is-4 has-text-white' style={{ WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', display: '-webkit-box', fontWeight: 900 }}>{bot.username} {bot.certified ? <FontAwesomeIcon icon={faCertificate}/> : <></>}</p>
              <p className='subtitle is-6 has-text-grey' style={{ WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', display: '-webkit-box' }}>{bot.description.short}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

class Bots extends React.Component {
  props: any
  state: any

  render () {
    return (
      <>
        <h1 className='has-text-white is-size-1' style={{ fontWeight: 900 }}>{this.props.isUser ? 'My Bots' : 'Bots'}</h1>
        <div className='columns'>
          {this.props.bots.map((bot: any) => <Bot key={bot.id} bot={bot}/>)}
        </div>
      </>
    )
  }
}

class User extends React.Component {
  props: any
  state: any

  constructor (props: any) {
    super(props)
    const id = props?.match?.params?.id
    this.state = {
      user: null,
      bots: [],
      isUser: true
    }

    axios.get(`/v1/users/${id}`)
      .then(result => {
        const isUser = this.props.isAuthenticated ? id === this.props.user.id : false
        const bots = isUser ? result.data?.bots : result.data?.bots.filter((bot: any) => bot.approved)
        this.setState({
          user: result.data?.user,
          bots: bots,
          isUser: isUser
        })
      })
      .catch(error => console.error(error))
  }

  render () {
    return (
      <div className='column' style={{ paddingLeft: 0, overflowY: 'scroll' }}>
        <div style={{ overflowY: 'scroll' }}>
          <div className='image banner has-background-primary' style={{ objectFit: 'cover', border: 0, backgroundSize: 'cover' }} />
          <div className='bot-body' style={{ marginBottom: '150px', marginTop: '50px' }}>
            <h1 className='has-text-white is-size-4'>{this.state.isUser && this.props.isAuthenticated ? <>Hello, <strong>{this.props.user.username}#{this.props.user.discriminator}</strong>!</> : `${this.state?.user?.username}#${this.state?.user?.discriminator}`}</h1>
            {this.state.user ? <Bots isUser={this.state.isUser} bots={this.state.bots} /> : <></>}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => ({
  user: state.auth.user || null,
  isAuthenticated: state.auth.isAuthenticated || false,
  loading: state.auth.loading || false
})

export default connect(mapStateToProps)(User)
