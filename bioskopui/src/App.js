import React, { Component } from 'react'; // //#1
import Header from './components/header'
import Home from './pages/home'
import './App.css';
import {Switch,Route} from 'react-router-dom'
import ManageAdmin from './pages/manageadmin'
import Login from './pages/login'
import MovieDetail from './pages/movie-detail'
import BeliTiket from './pages/belitiket'
import Register from './pages/register';
import {connect} from 'react-redux'
import {LoginSuccessAction, keranjangAction} from './redux/actions'
import Axios from 'axios';
import { APIURL } from './support/ApiURL';
import Loader from 'react-loader-spinner'
import Cart from './pages/cart';
import NotFound from './pages/notfound';
import ResetPassword from './pages/resetpassword'
import ManageStudio from './pages/managestudio'

class App extends Component { // //karena berupa container, gunakan class
  state = { 
    loading: true, // //di saat belum selesai render data, buat status loading true
    keranjang: []
   }

// //=========================================================================================================// //

   componentDidMount() { // //buat function untuk mount data
    var id = localStorage.getItem('user') // //buat proteksi, agar tiap berpindah halaman, username yang sedang login tidak keluar
    Axios.get(`${APIURL}users/${id}`)
      .then((res) => {
        Axios.get(`${APIURL}orders?userId=${res.data.id}`)
          .then((res2) => {
            console.log(res2.data)
            this.setState({
              keranjang: res2.data
            })
            // this.props.keranjangAction(res2.data.length)
          }).catch((err) => {
            console.log(err)
          })
        this.props.LoginSuccessAction(res.data)
        // this.setState({ loading: false })
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        this.setState({ loading: false })
      })
    // console.log(this.props.keranjang)
  }

// //=========================================================================================================// //

  render() { // //menampilkan (render) component yang telah dibuat dan diimpor
    this.props.keranjangAction(this.state.keranjang.length)
    if (this.state.loading) { // //jika keadaan masih loading
      return <Loader
        type='Puff'
        color='#00918e'
        height={100}
        width={100}
      />
    }

    return ( // //render komplit data
      <div>
      <Header/>
        <Switch>
          <Route path={'/'} exact>
            <Home/>
          </Route>
          <Route path={'/manageadmin'} exact >
            <ManageAdmin/>
          </Route>
          <Route path={'/managestudio'} exact >
            <ManageStudio/>
          </Route>
          <Route path='/moviedetail/:id' component={MovieDetail} exact />
          <Route path='/belitiket' exact component={BeliTiket} />
          <Route path={'/login'} exact component={Login}/>
          <Route path='/cart' exact component={Cart} />
          <Route path='/resetpassword' exact component={ResetPassword} />
          <Route path={'/register'} exact component={Register} />
          <Route path='/*' exact component={NotFound} />
        </Switch>
      </div>
     );
  }
}

const MapstateToprops=(state)=>{ // //melakukan map state ke props
  return{
      AuthLog:state.Auth.login,
      UserId: state.Auth.id,
      keranjang: state.Auth.keranjang
  }
}
 
export default connect(MapstateToprops,{LoginSuccessAction, keranjangAction})(App);