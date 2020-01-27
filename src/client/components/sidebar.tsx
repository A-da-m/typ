import * as React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot, faUsers, faSearch, faUser } from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux'

class Sidebar extends React.Component {
  props: any
  state: any

  constructor (props: any) {
    super(props)

    this.state = {
      dropdown: false
    }
  }

  render () {
    return (
      <div className='column is-narrow has-background-black has-text-centered is-fullheight is-hidden-mobile' style={{ height: '100%', paddingRight: 0, paddingTop: '3%' }}>
        <div style={{ width: '110px' }}>
          <div style={{ display: 'block' }}>
            <h3 className='has-text-weight-bold has-text-white is-size-4'>typ</h3>
            <aside className='menu'>
              <p className='menu-label'>
                List
              </p>
              <ul className='menu-list'>
                <li><a href='/' style={{ paddingBottom: '2rem', paddingTop: '2rem' }}><FontAwesomeIcon icon={faRobot} size='2x'/></a></li>
                <li><a href='/servers' style={{ paddingBottom: '2rem', paddingTop: '2rem' }}><FontAwesomeIcon icon={faUsers} size='2x'/></a></li>
                <li><a href='/search' style={{ paddingBottom: '2rem', paddingTop: '2rem' }}><FontAwesomeIcon icon={faSearch} size='2x'/></a></li>
              </ul>
            </aside>
          </div>
        </div>
        {this.props.isAuthenticated ?
        <div className={`dropdown ${this.state.dropdown ? 'is-active' : ''} is-right`} style={{ position: 'absolute', right: 25, top: 25, borderRadius: '25px', width: '3rem', zIndex: 100 }}>
          <div className='dropdown-trigger'>
            <img style={{ borderRadius: '50%', cursor: 'pointer' }} onClick={() => this.setState({ dropdown: !this.state.dropdown })} src={this.props.user?.avatar ? `https://cdn.discordapp.com/avatars/${this.props.user.id}/${this.props.user.avatar}.png?size=256` : 'https://cdn.discordapp.com/embed/avatars/0.png'} />
          </div>
          <div className='dropdown-menu' id='dropdown-menu' role='menu'>
            <div className='dropdown-content has-background-black'>
              <p className='dropdown-item has-text-white'>
                Logged in as <strong>{this.props.user.username}#{this.props.user.discriminator}</strong>
              </p>
              <hr className='dropdown-divider has-background-black-bis' />
              <a href={`/user/${this.props.user.id}`} className='dropdown-item has-text-white'>
                My Account
              </a>
              <a href='/bot' className='dropdown-item has-text-white'>
                Add Bot
              </a>
              <hr className='dropdown-divider has-background-black-bis' />
              <a href='/auth/logout' className='dropdown-item has-text-danger'>
                Logout
              </a>
            </div>
          </div>
        </div>
        : <a href='/auth/login' className='has-text-white'><FontAwesomeIcon style={{ position: 'absolute', right: 25, top: 25, borderRadius: '25px', width: '3rem', zIndex: 100 }} icon={faUser} size='2x'/></a>}
      </div>
    )
  }
}

const mapStateToProps = (state: any) => ({
  user: state.auth.user || null,
  isAuthenticated: state.auth.isAuthenticated || false,
  loading: state.auth.loading || false
})

export default connect(mapStateToProps)(Sidebar)
