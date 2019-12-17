import React, { Component } from 'react';// //#16
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import {Carousel} from 'react-responsive-carousel'
import imax from '../components/img/carousel/imax.png'
import streamingcomp from '../components/img/carousel/streamingcomp.png'
import threedcinema from '../components/img/carousel/3dcinema.png'

class CarouselSlide extends Component {
    state = {  }
    render() { 
        return ( 
            <Carousel>
                <div>
                    <img src={imax}></img>
                    <p className="desccarousel" style={{color: 'white', fontSize: 50, marginTop: -200}}>ENJOY MOVIES WITH IMAX</p>
                </div>
                <div>
                    <img src={streamingcomp}></img>
                    <p className="desccarousel" style={{color: 'black', fontSize: 50, marginTop: -200}}>WATCH THE BEST FILMS FROM VARIOUS STREAMING COMPANIES</p>
                </div>
                <div>
                    <img src={threedcinema}></img>
                    <p className="desccarousel" style={{color: 'white', fontSize: 50, marginTop: -200}}>WATCH IT IN 3D</p>
                </div>
            </Carousel>
         );
    }
}
 
export default CarouselSlide;