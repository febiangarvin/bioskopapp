import React, { useState } from 'react'; // //#3
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
// import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import { LogoutActions } from './../redux/actions/AuthActions'
import { Icon, SidebarPusher } from 'semantic-ui-react'
import Logo from './img/logo.png'
// import { Link } from '@material-ui/core';
// import {FaCartPlus} from 'react-icons/fa'

// //=========================================================================================================// //

const Logoutbtn = () => {
  localStorage.removeItem('user')
  this.props.LogoutActions()
}

// //=========================================================================================================// //

const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div style={{marginBottom:50}}>
    <Navbar expand='md' className='topHeader'>
        <NavbarBrand className='menuHeader' href="/">
          <div className='nav-logo' style={{fontSize:25}}>
            <img src={Logo} alt=''/>
              Stream & Chill
            </div>
        </NavbarBrand>

        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {props.namauser === '' ?
              <NavItem>
                <NavLink href={'/login'} className='mr-5 menuHeader' style={{fontSize:20}}>Login</NavLink>
              </NavItem>
              :
              null
            }

            {
              props.namauser === '' ? null : props.role === 'admin' ? (
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret style={{ color: 'white' }}>
                    <Icon name='user circle' size='large' className='mr-2' />Welcome back, {props.namauser}
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem href='/manageadmin'>Manage Admin</DropdownItem>
                    <DropdownItem href='/managestudio'>Manage Studio</DropdownItem>
                    <DropdownItem href={'/'} onClick={Logoutbtn}>Logout </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )
                :
                props.role === 'user' ? (
                  
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret style={{ color: 'white' }} className='mt-4'>
                      <Icon name='user circle' size='large' className='mr-2' />Hello, {props.namauser}
                    </DropdownToggle>
                    <DropdownMenu right style={{ backgroundColor: 'white' }}>
                      <DropdownItem href='/cart'><Icon name='shopping cart' />Cart ({props.keranjang})</DropdownItem>
                      <DropdownItem href='/resetpassword' ><Icon name='vcard' />Change Password</DropdownItem>
                      <DropdownItem href={'/'} onClick={Logoutbtn}><Icon name='user outline' />Logout </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                ) : null
            }

          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

// //=========================================================================================================// //

const MapstateToprops=(state)=>{
  return{
      namauser:state.Auth.username,
      Auth: state.Auth.login,
      role: state.Auth.role,
      notif: state.Auth.notif,
      UserId: state.Auth.id,
      keranjang: state.Auth.keranjang
  }
}

export default connect(MapstateToprops, { LogoutActions })(Header);