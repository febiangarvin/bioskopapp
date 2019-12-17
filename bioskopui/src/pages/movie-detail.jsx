import React, { Component } from 'react'; // //#13
import Axios from 'axios';
import { APIURL } from '../support/ApiURL';
// import Belitiket from './belitiket'
import {Modal,ModalBody,ModalFooter, Alert} from 'reactstrap'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import Fade from 'react-reveal/Fade'

class MovieDetail extends Component {
    state = { 
        datadetailfilm:{}, // //buat state kosong untuk nantinya menampung data
        traileropen:false, // //buat status function dalam keadaan false (yang nanti akan dibuat ke true dalam function)
        notloginyet:false,
        kelogin:false,
        belitiketok:false,
        proteksiadmin: false
     }

// //=========================================================================================================// //

     componentDidMount(){
         Axios.get(`${APIURL}movies/${this.props.match.params.id}`) // //mengambil data dari db
         .then(res=>{ // //jika axios berhasil diambil
             this.setState({datadetailfilm:res.data}) // //maka, akan men-setting state dari data (db) ke state kosong yang sudah dibuat
         }).catch(err=>{ // //jika gagal di load
            console.log(err);
         })
     }

// //=========================================================================================================// //

     onBeliTiketClick=()=>{ // //function untuk beli tiket
        if (this.props.roleadmin === 'admin'){
            this.setState({proteksiadmin:true, belitiketok: false})
        }
        else if(this.props.AuthLog && this.props.roleadmin === 'user'){ // //jika status sudah login
            this.setState({belitiketok:true})
        }
        else{ // //jika status belum login
            this.setState({notloginyet:true})
        }
    }

// //=========================================================================================================// //

    render() {
        if(this.state.kelogin){
            return <Redirect to={'/login'}/>
        }
        if (this.state.belitiketok){
            return <Redirect to={{pathname:'/belitiket', state: this.state.datadetailfilm}}/>
        }

        return ( 
            <div>
                                                {/* MEMBUKA MODAL TRAIILER*/}
                <Modal isOpen={this.state.traileropen} size='lg' toggle={()=>this.setState({traileropen:false})}
                   contentClassName=' trailer' >
                    {/* body modal */}
                    <ModalBody className='p-0 bg-transparent'>
                        <iframe width="100%" title={this.state.datadetailfilm.title} height="100%" src={this.state.datadetailfilm.trailer} 
                            frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                        </iframe>
                    </ModalBody>
                </Modal>

                                        {/* MEMBUKA MODAL KETERANGAN BELUM LOGIN */}
                <Modal isOpen={this.state.notloginyet} centered toggle={()=>this.setState({notloginyet:false})}>
                    {/* body modal */}
                    <ModalBody>
                        Please Log-In First
                    </ModalBody>
                    {/* footer modal */}
                    <ModalFooter>
                        <button onClick={()=>this.setState({kelogin:true})}>Ok</button>
                    </ModalFooter>
                </Modal>

                                        {/* MEMBUKA MODAL PROTEKSI ADMIN */}
                <Fade>
                    <Alert className='alert alert-danger' isOpen={this.state.proteksiadmin} toggle={() => this.setState({proteksiadmin:false})}>
                        Log-in as a User to buy tickets
                    </Alert>
                </Fade>

                                                {/* DIVISI DETAIL FILM */}
                <div className="row p-3 mx-3 my-4">

                    <div className="col-md-4">
                        <img src={this.state.datadetailfilm.image} height='400' alt="film"/>
                        <div className='mt-3' style={{fontSize:'30px'}}>
                            {this.state.datadetailfilm.title}
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className='mt-1'>
                            Title <span className='ml-4'>:</span>  
                        </div>
                        <div className='mt-1'>
                            Sinopsis <span className='ml-2'>:</span>  
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className='mt-1'>
                            {this.state.datadetailfilm.title}
                        </div>
                        <div className='mt-1'>
                            {this.state.datadetailfilm.sinopsis}
                        </div>
                        <div className='mt-3'>
                            <button className='mr-3 btn btn-primary' onClick={this.onBeliTiketClick} >Beli tiket</button>
                            <button className=' btn btn-outline-warning' onClick={()=>this.setState({traileropen:true})}>Trailer</button>
                        </div>
                    </div>
                    
                </div>
            </div>
         );
    }
}

const MapstateToprops=(state)=>{
    return{
        AuthLog:state.Auth.login,
        roleadmin:state.Auth.role
    }
}

export default connect(MapstateToprops)(MovieDetail);