import * as React from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot, faUsers, faSearch, faHamburger } from '@fortawesome/free-solid-svg-icons'

class NavBar extends React.Component {
  props: any
  state: any

  constructor (props: any) {
    super(props)
    this.state = {
      dropdown: false,
      loginDropdown: false
    }
  }

  render () {
    return (
      <div className='is-hidden-tablet'>
        <div className='navbar is-black' style={{ height: '70px' }}>
          <div className='navbar-brand' style={{ height: '100%', display: 'flex' }}>
            <a className='navbar-item has-text-weight-bold has-text-white' href='/' style={{ padding: 0, margin: 0, fontWeight: 900, fontSize: 20, height: '100%' }}>typ</a>
            <span className='nb'><a className='navbar-item has-text-weight-bold has-text-white' onClick={() => this.setState({ dropdown: !this.state.dropdown })} style={{ padding: 0, margin: 0, fontWeight: 900, fontSize: 20, height: '100%' }}><FontAwesomeIcon icon={faHamburger} /></a></span>
          </div>
          {this.state.dropdown ?
            <div id='navbarExampleTransparentExample' className='navbar-menu is-active has-background-grey' onClick={() => this.setState({ loginDropdown: !this.state.loginDropdown })}>
              <div className='navbar-start'>
                <a className='navbar-item' href='/'>Bots</a>
                <a className='navbar-item' href='/servers'>Servers</a>
                {this.props.isAuthenticated ?
                <div className='navbar-item has-dropdown is-hoverable'>
                  <a className='navbar-link' onClick={() => this.setState({ loginDropdown: !this.state.loginDropdown })}>
                    {this.props.user.username}#{this.props.user.discriminator}
                  </a> {this.state.loginDropdown ?
                  <div className='navbar-dropdown is-boxed'>
                    <a className='navbar-item' href='/@me'>
                      My Account
                    </a>
                    <a className='navbar-item' href='/bot'>
                      Add Bot
                    </a>
                    {this.props.user.admin ? <a className='navbar-item' href='/bot'>Queue</a> : <></>}
                    <a className='navbar-item has-text-danger' href='/auth/logout'>
                      Logout
                    </a>
                  </div>
                  : <></>}
                </div>
                : <a className='navbar-item' href='/auth/login'>Login</a>}
              </div>
            </div>
          : ''}
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

export default connect(mapStateToProps)(NavBar)
