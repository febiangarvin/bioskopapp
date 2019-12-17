import React, { Component } from 'react'; // //#6
import {Link,Redirect} from 'react-router-dom'
import Axios from 'axios';
import { APIURL } from '../support/ApiURL';
import {connect} from 'react-redux'
import {LoginSuccessAction} from './../redux/actions'
import Loader from 'react-loader-spinner'

class Login extends Component {
    state = { 
        error: '', // //membuat state yang akan diisi, apabila dalam kegiatan login terjadi kesalahan
        loading: false, // //buat start loading dalam keadaan false (false: data belum ter-load, true: data sudah load)
     }

// //=========================================================================================================// //

     onLoginClick = () =>{ // //membuat function untuk tombol login
         var username = this.refs.username.value // //buat variable username (sesuai data di db), dengan merefrensikan value dari db
         var password = this.refs.password.value // //buat variable username (sesuai data di db), dengan merefrensikan value dari db
         this.setState({loading:true}) // //apabila akan melakukan tahap login, maka loading menjadi false (seperti jeda)
         Axios.get(`${APIURL}users?username=${username}&password=${password}`) // //mengambil data usernamedan password dari db
         .then(res=>{ // //akan jalan jika data sudah diambil
             if(res.data.length){ // //jika data yang telah dimasukan sesuai dengan data yang ada
                 localStorage.setItem('user', res.data[0].id)
                 // //dengan localStorage yang gunannya mengambil data dari db, gunakan proteksi (parameter string), agar id (user) yang masuk tidak bisa lebih dari 1
                 this.props.LoginSuccessAction(res.data[0]) // //mengambil function yang dilakukan oleh action
             }
             else{
                 this.setState({error: 'Data Invalid'}) // //jika login salah
             }
             this.setState({loading:false}) // //setelah urusan dengan login selesai (berhasil/gagal), maka loading selesai
         }).catch((err)=>{ // //jika data gagal diambil, maka akan kembali ke halaman sebelumnya
             console.log(err);
             this.setState({loading:false})
         })
     }

// //=========================================================================================================// //

     render() {
        if(this.props.AuthLog){ // //jika berhasil login, maka akan redirect ke home
            return <Redirect to={'/'}/>
        } 
        return (
            <div>
                <div className=' mt-3 d-flex justify-content-center'>
                    <div style={{width:'500px',border:'1px solid black'}} className='rounded p-2'>
                        <h1>Login</h1>
                        <div className='p-1' style={{borderBottom:'1px solid black'}}>
                            <input type="text" className='username' style={{border:'transparent',width:'100%',fontSize:'20px'}} ref='username' placeholder='Your Username'/>
                        </div>
                        <div className='p-1' style={{borderBottom:'1px solid black'}}>
                            <input type="password" className='username' style={{border:'transparent',width:'100%',fontSize:'20px'}} ref='password' placeholder='Your Password'/>
                        </div>
                        {this.state.error===''?
                            null
                            :
                            <div className="alert alert-danger mt-2">
                                {this.state.error} <span onClick={()=>this.setState({error:''})} className='float-right font-weight-bold'>X</span>
                            </div>
                    
                        }
                        <div className='mt-4'>
                            {this.state.loading?
                                <Loader
                                    type="Puff"
                                    color="#00BFFF"
                                    height={100}
                                    width={100}
                                />
                                :
                                <button className='btn btn-primary' onClick={this.onLoginClick}>Login</button>
                            }
                        </div>
                        <div className='mt-2'>
                        <Link to='/register'>Have you joinned us yet?</Link>
                        </div>
                    </div>
                </div>
            </div>
          );
    }
}

const MapStateToProps=(state)=>{ // //buat variable dengan function untuk memetakan state kepada props
    return{ // //tujuannya untuk memberikan hasil dari state dengan status login-nya
        AuthLog:state.Auth.login
    }
}
 
export default connect(MapStateToProps, {LoginSuccessAction}) (Login);
// //berikan HOC kepada component ini dengan variable Map dan function component dari Action