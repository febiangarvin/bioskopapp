import React, { Component } from 'react';// //#18
import img_detail1 from '../components/img/detail/detail1.png'

class DetailAtas extends Component {
    state = {  }
    render() { 
        return ( 
            <section className='detailatas'>
                <div className="detail1" style={{marginLeft:-200, marginRight:-50}}>
                    <h1 style={{fontSize:20}}>
                        Enjoy in 3D &nbsp; <span>&nbsp;</span>
                    </h1>
                    <br/>
                    <h3 style={{fontSize:50}}>
                        Excite yourself <br/> with your favourite movies <br/> in 3D
                    </h3>
                    <p style={{marginTop:40, fontSize:20, color:'black'}}>
                        With our 3D services, we will bring you closer to the characters <br/>
                        - so you can immerse yourself in the story.
                    </p>
                </div>
                <div className="img_detail1" style={{marginRight:-100, marginLeft:-140, marginTop:30}}>
                    <img src={img_detail1} alt="" />
                </div>
            </section>
         );
    }
}
 
export default DetailAtas;