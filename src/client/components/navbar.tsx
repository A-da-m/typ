import * as React from 'react'
import { connect } from 'react-redux'

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
        <div className='navbar is-black'>
          <div className='navbar-brand'>
            <a className='navbar-item has-text-weight-bold has-text-white' href='/' style={{ padding: 0, margin: 0, fontWeight: 900 }}>typ</a>
            <div className='navbar-burger burger' style={{ padding: 0, width: 'auto' }} onClick={() => this.setState({ dropdown: !this.state.dropdown })}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          {this.state.dropdown ?
            <div id='navbarExampleTransparentExample' className='navbar-menu is-active'>
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
