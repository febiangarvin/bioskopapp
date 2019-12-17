import React, { Component } from 'react';// //#17
import imgsp1 from '../components/img/layanan/imgsp1.png'
import imgsp2 from '../components/img/layanan/imgsp2.png'
import imgsp3 from '../components/img/layanan/imgsp3.png'
import imgsp4 from '../components/img/layanan/imgsp4.png'
import imgsp5 from '../components/img/layanan/imgsp5.png'
import imgsp6 from '../components/img/layanan/imgsp6.png'

class Layanan extends Component {
    state = {  }
    render() { 
        return (
            <section className='isiLayanan' style={{marginLeft:0, marginRight:0, justifyContent:'center'}}>
                <div className='titlelayanan'>Our Partnering Services...</div>
                <section className='bodyLayanan' style={{marginLeft:0, marginRight:0}}>
                    <div className="imagelayanan"><img src={imgsp1} alt=''/></div>
                    <div className="imagelayanan"><img src={imgsp2} alt=''/></div>
                    <div className="imagelayanan imagelayanan3"><img src={imgsp3} alt=''/></div>
                    <div className="imagelayanan imagelayanan4"><img src={imgsp4} alt=''/></div>
                    <div className="imagelayanan"><img src={imgsp5} alt=''/></div>
                    <div className="imagelayanan imagelayanan6"><img src={imgsp6} alt=''/></div>
                </section>
                <div className='footerlayanan'>And Many More...</div>
            </section>
         );
    }
}
 
export default Layanan;