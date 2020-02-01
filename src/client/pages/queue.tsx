import * as React from 'react'
import { useHistory } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCertificate } from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux'
import axios from 'axios'
import Title from '../components/title'

const Bot = ({ bot }: any) => {
  const history = useHistory()
  return (
    <div className='column is-full-mobile is-half-tablet is-half-desktop is-one-third-widescreen is-one-quarter-fullhd'>
      <div className='card' style={{ borderRadius: '12px', backgroundColor: '#171717' }} onClick={() => history.push(`/bot/${bot.id}`)}>
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

class Queue extends React.Component {
  props: any
  state: any

  constructor (props: any) {
    super(props)

    this.state = {
      bots: []
    }

    axios.get('/v1/bots')
      .then(result => {
        const bots = result.data.filter((bot: any) => !bot.approved)
        bots.sort((a: any, b: any) => b.date - a.date)
        this.setState({
          bots: bots
        })
      })
      .catch(error => console.error(error))
  }

  render () {
    return (
      <>
        <h1 className='has-text-white is-size-3' style={{ fontWeight: 900, marginBottom: '10px' }}>Queue</h1>
        <div className='columns is-multiline'>
          {this.state.bots.map((bot: any) => <Bot key={bot.id} bot={bot}/>)}
        </div>
      </>
    )
  }
}

class AllBots extends React.Component {
  props: any
  state: any

  constructor (props: any) {
    super(props)

    this.state = {
      bots: []
    }

    axios.get('/v1/bots')
      .then(result => {
        const bots = result.data.filter((bot: any) => bot.approved)
        bots.sort((a: any, b: any) => b.date - a.date)
        this.setState({
          bots: bots
        })
      })
      .catch(error => console.error(error))
  }

  render () {
    return (
      <>
        <h1 className='has-text-white is-size-3' style={{ fontWeight: 900, marginBottom: '10px' }}>Bots</h1>
        <div className='columns is-multiline'>
          {this.state.bots.map((bot: any) => <Bot key={bot.id} bot={bot}/>)}
        </div>
      </>
    )
  }
}

class Bots extends React.Component {
  props: any

  render () {
    return (
      <>
        <Title
          title={null}
          description={null}
          url={null}
          image={null}
        />
        <div className='column' style={{ height: '100%', padding: '5%', overflowY: 'scroll' }}>
          <h1 className='has-text-weight-normal has-text-grey-light is-size-3'>Admin</h1>
          <Queue />
          <AllBots />
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

export default connect(mapStateToProps)(Bots)
