import React, { Component } from "react"; // //#20
import Logo from '../components/img/logo.png'
import {FaPlay} from 'react-icons/fa';
import { NavItem, NavLink } from "reactstrap";

class Footer extends Component {
  state = {};
  render() {
    return (
      <section className="footerBody" style={{marginLeft:-50, marginRight:-50}}>
        <div className="elemen">
          <h2>
            Enter a new era of watching movies outside your house <br /> with high quality movies and up-to-date series.
          </h2>
          <h5>Enjoy a new member discount up to 70%</h5>
          <NavItem>
              <NavLink href={'/login'}>
                <button className="buttonstarted">
                    I WANT IN &nbsp;<FaPlay />
                </button>
              </NavLink>
          </NavItem>
        </div>
        <div className="elemenbawah">
          <div className="logobawah">
            <img src={Logo} alt="" style={{height: 60, width: 150, marginLeft: 20}}/>
          </div>
          <div className="copyright" style={{fontSize:13, marginLeft:-50}}>
            <p>© 2019-2020 Purwadhika Studios, Inc. All Rights Reserved. Stream & Chill is still running on Beta Version.</p>
          </div>
          <div className="policy" style={{fontSize:15}}>
            <p>Terms of Service | Privacy Policy | Ad Choices | DMCA | Contact Us</p>
          </div>
        </div>
      </section>
    );
}
}

export default Footer;