import React, { Component } from 'react'; // //#19
import img_detail2 from '../components/img/detail/detail2.png'

class DetailTengah extends Component {
    state = {  }
    render() { 
        return ( 
            <section className="detailtengah">
                <div className="img_detail2" style={{marginLeft:-70, marginTop:50}}>
                    <img src={img_detail2} alt="" />
                </div>
                <div className="detail2" style={{marginRight:-90, marginLeft:-80}}>
                    <h1 style={{fontSize:20}}>
                        Why us? &nbsp; <span>&nbsp;</span>
                    </h1>
                    <h3 style={{fontSize:50}}>
                        Enjoy a day out <br /> and experience movies <br /> from your favourite <br/> streaming company.
                    </h3>
                    <p style={{marginTop:40, fontSize:20, color:'black'}}>
                        We are the first theater to serve you movies from <br/>various multi-streaming companies, with a variety of <br/> series, block-buster movies, and films in 3D options.
                    </p>
                </div>
            </section>
         );
    }
}
 
export default DetailTengah;