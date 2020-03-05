import * as React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot, faUsers, faSearch, faUser } from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import rateLimit from 'axios-rate-limit'
class Sidebar extends React.Component {
  props: any
  state: any

  constructor (props: any) {
    super(props)

    this.state = {
      dropdown: false,
      search: false,
      searchQuery: null,
      invaildSearch: false
    }

    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (event: React.FormEvent) {
    event.preventDefault()
    const http = rateLimit(axios.create(), { maxRequests: 2, perMilliseconds: 2000 })
    if (!this.state.searchQuery) return
    http.get(`/v1/bots?search=${this.state.searchQuery}`)
      .then((result) => {
        console.log(result)
        if (!result?.data[0]?.id) return this.setState({ invaildSearch: true })
        this.setState({ search: false, searchQuery: null })
        return this.props.history.push(`/bot/${result.data[0].id}`)
      })
      .catch(error => console.error(error))
  }

  render () {
    return (
      <>
      <div className='typ-navbar has-background-black'>
        <ul className='typ-navbar-nav'>
          <li className='typ-navbar-logo'>
            <img style={{ maxWidth: '5rem' }} src='/images/logo/typ-darktransparent.png' />
          </li>
          <li className='typ-navbar-item'>
            <a className='typ-navbar-item-link' href='/'>
              <FontAwesomeIcon icon={faRobot} size='2x'/>
            </a>
          </li>
          <li className='typ-navbar-item'>
            <a className='typ-navbar-item-link' href='/servers'>
              <FontAwesomeIcon icon={faUsers} size='2x'/>
            </a>
          </li>
          <li className='typ-navbar-item'>
            <a className='typ-navbar-item-link' onClick={() => this.setState({ search: !this.state.search })}>
              <FontAwesomeIcon icon={faSearch} size='2x'/>
            </a>
          </li>
          <li className='typ-navbar-item'>
            {this.props.isAuthenticated
              ? (
                <div className={`typ-navbar-dropdown dropdown is-up ${this.state.dropdown ? 'is-active' : ''}`} style={{ borderRadius: '25px', width: '3rem', zIndex: 9 }}>
                  <div className='dropdown-trigger'>
                    <img style={{ borderRadius: '50%', cursor: 'pointer' }} onClick={() => this.setState({ dropdown: !this.state.dropdown })} src={this.props.user?.avatar ? `https://cdn.discordapp.com/avatars/${this.props.user.id}/${this.props.user.avatar}.png?size=256` : 'https://cdn.discordapp.com/embed/avatars/0.png'} />
                  </div>
                </div>
              )
              : (
                <a className='typ-navbar-item-link' href='/auth/login'>
                  <FontAwesomeIcon icon={faUser} size='2x'/>
                </a>
              )
            }
          </li>
        </ul>
      </div>
      {this.state.dropdown ?
        <div className='modal is-active'>
          <div className='modal-background'></div>
          <div className='modal-card has-background-black'>
            <header className='modal-card-head has-background-link' style={{ border: 0 }}>
              <p className='modal-card-title'><strong>Account</strong></p>
              <button className='delete' aria-label='close' onClick={() => this.setState({ dropdown: !this.state.dropdown })}></button>
            </header>
            <section className='modal-card-body has-background-dark has-text-white' style={{ border: 0 }}>
              Logged in as <strong>{this.props.user.username}#{this.props.user.discriminator}</strong>
            </section>
            <footer className='modal-card-foot has-background-dark' style={{ border: 0, paddingTop: 0 }}>
              <a href='/auth/logout' className='button is-danger'>Logout</a>
              <a href='/bot' className='button'>New Bot</a>
              <a href={`/user/${this.props.user.id}`} className='button'>Current Bots</a>
              {this.props.user.admin ? <a href='/queue' className='button is-link'>Queue</a> : <></>}
            </footer>
          </div>
        </div>
      : ''}
      </>
    )
  }
}

const mapStateToProps = (state: any) => ({
  user: state.auth.user || null,
  isAuthenticated: state.auth.isAuthenticated || false,
  loading: state.auth.loading || false
})

export default withRouter(connect(mapStateToProps)(Sidebar))

//   {/* {this.state.redirect ? <Redirect to={this.state.redirect}/> : <></>}  */}
//   {this.state.search ? <div style={{ position: 'absolute', left: 120, zIndex: 1000, top: 328 }}>
//     <form onSubmit={this.onSubmit}>
//       <input className={`input ${this.state.invaildSearch ? 'is-danger' : ''}`} type='text' placeholder='Search' style={{ padding: 15 }} onChange={(event) => this.setState({ searchQuery: event.target.value })} />
//     </form>
//   </div> : <></>}
//   {this.props.isAuthenticated ?
//   <div className={`dropdown ${this.state.dropdown ? 'is-active' : ''} is-right`} style={{ position: 'absolute', right: 25, top: 25, borderRadius: '25px', width: '3rem', zIndex: 100 }}>
//     <div className='dropdown-trigger'>
//       <img style={{ borderRadius: '50%', cursor: 'pointer' }} onClick={() => this.setState({ dropdown: !this.state.dropdown })} src={this.props.user?.avatar ? `https://cdn.discordapp.com/avatars/${this.props.user.id}/${this.props.user.avatar}.png?size=256` : 'https://cdn.discordapp.com/embed/avatars/0.png'} />
//     </div>
//     <div className='dropdown-menu' id='dropdown-menu' role='menu'>
//       <div className='dropdown-content has-background-black'>
//         <p className='dropdown-item has-text-white'>
//           Logged in as <strong>{this.props.user.username}#{this.props.user.discriminator}</strong>
//         </p>
//         <hr className='dropdown-divider has-background-black-bis' />
//         <a href={`/user/${this.props.user.id}`} className='dropdown-item has-text-white'>
//           My Account
//         </a>
//         <a href='/bot' className='dropdown-item has-text-white'>
//           Add Bot
//         </a>
//         {this.props.user.admin ? <><hr className='dropdown-divider has-background-black-bis' /><a className='dropdown-item has-text-white' href='/queue'>Queue</a></> : <></>}
//         <hr className='dropdown-divider has-background-black-bis' />
//         <a href='/auth/logout' className='dropdown-item has-text-danger'>
//           Logout
//         </a>
//       </div>
//     </div>
//   </div>
//   : <a href='/auth/login' className='has-text-white'><FontAwesomeIcon style={{ position: 'absolute', right: 25, top: 25, borderRadius: '25px', width: '3rem', zIndex: 100 }} icon={faUser} size='2x'/></a>}
// </div>
