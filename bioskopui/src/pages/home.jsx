import React, { Component } from 'react'; // //#4
import Axios from 'axios'
import { Link } from 'react-router-dom'
import CarouselSlide from './carousel'
import Layanan from './layanan'
import DetailAtas from './detailatas'
import DetailTengah from './detailtengah'
import Footer from './footer'

const url = 'http://localhost:2000/'

class Home extends Component { // //berupa container
    state = { 
        dataMovies: [] // //buat state kosong guna menampung data 
     }

// //=========================================================================================================// //

     componentDidMount(){
         Axios.get(`${url}movies`) // //mengambil data dari database (db.json) movies
         .then ((res)=>{ // //setelah data didapatkan (axios), maka akan menunjukan result (res)
             console.log(res);
             this.setState({dataMovies:res.data}) // //data yang didapatkan (dari db.json) akan di didorong ke state dataMovies
         })
         .catch((err)=>{ // //bila data tidak didapatkan, maka akan mengambil error
             console.log(err); // //tunjukkan di console.log (untuk mengetahui)
         })
     }

// //=========================================================================================================// //

    renderMovies=()=>{
        // //menggunakan callback function untuk memetakan data dari state yang telah dibuat. val = value (isi). index = index (urutan) array
        return this.state.dataMovies.map((val,index)=>{
            return(
                <div key={index} className="col-md-3 py-5 pr-3 pl-1 ">
                        <div className="card kartu " style={{width: '100%'}}>
                            <div className="gambardalamkartu">
                                <Link to={'/moviedetail/'+val.id}>
                                    <img src={val.image} className="card-img-top kartu gambar" alt="..." />
                                </Link>
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">{val.title}</h5>
                            </div>
                        </div>
                    </div>
            )

        })
    }

// //=========================================================================================================// //

    render() { // //render akhir dari component (yang akan di ekspor)
        return ( 
            <div className='mx-5 body'>
                <CarouselSlide/>
                <div className="row py-5" style={{paddingLeft: '10%', paddingRight: '10%', marginTop: -80}}>
                    {/* mengambil renderMovies yang telah dibuat di atas */}
                    {this.renderMovies()}
                </div>
                <Layanan/>
                <DetailAtas/>
                <DetailTengah/>
                <Footer/>
            </div>
          );
    }
}
 
export default Home;