import React, { Component } from 'react'
import { connect } from 'react-redux'
import Axios from 'axios'
import { APIURL } from '../support/ApiURL'
import { Redirect } from 'react-router-dom'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import Numeral from 'numeral'
import NotFound from '../pages/notfound'
import {keranjangAction} from '../redux/actions'

class BeliTiket extends Component {
    state = {
        datamovie: {}, // //buat state kosong untuk menampung data
        seats: 260, // //state maksimal bangku 1 film
        baris: 0,
        booked: [], // //state kosong status bookingan
        loading: true, // //buat loading true untuk tahap awal
        jam: 12, // //state jam awal
        pilihan: [], // //state pilihan dengan array kosong, untuk nantinya diisi
        openmodalcart: false, // //status modal dalam keadaan false
        redirecthome: false
        // harga: 0,
        // jumlahtiket: 0
    }

// //=========================================================================================================// //

    componentDidMount() { // //buat component did mount untuk me-render data dalam sebuah function
        this.onJamchance()
    }

// //=========================================================================================================// //

    onJamchance = () => { // //function dari component did mount
        var studioId = this.props.location.state.studioId // //buat variable yang mengambil salah satu parameter data dari db
        var movieId = this.props.location.state.id
        Axios.get(`${APIURL}studios/${studioId}`) // //mengambil data dari db
            .then((res1) => { // //apabila axios berhasil
                Axios.get(`${APIURL}orders?movieId=${movieId}&jadwal=${this.state.jam}`) // //mengambil data film dari db
                    .then((res2) => { // //apabila axios kedua berhasil
                        var arrAxios = [] // //buat variable dengan array kosong untuk menampung metode push
                        res2.data.forEach((val) => { // //melakukan looping untuk semua data pada hasil axios kedua
                            // console.log(val)
                            arrAxios.push(Axios.get(`${APIURL}ordersDetails?orderId=${val.id}`))
                        })
                        // //looping axios berikutnya
                        var arrAxios2 = [] // //buat variable kedua dengan array kosong untuk menampung metode push
                        Axios.all(arrAxios).then((res3) => { // //Axios.all untuk melakukan map terhadap array yang sudha dibuat
                            // console.log(res3)
                            res3.forEach((val) => { // //melakukan looping untuk semua data pada hasil axios ketiga
                                arrAxios2.push(...val.data) // //melakukan push ke variable array kosong sebelumnya
                            })
                            console.log(arrAxios2)
                            this.setState({ // //mengatur ulang state
                                datamovie: this.props.location.state,
                                seats: res1.data.jumlahKursi,
                                baris: res1.data.jumlahKursi / 20,
                                booked: arrAxios2,
                                loading: false
                            })
                        }).catch((err) => {
                            console.log(err)
                        })
                    }).catch((err2) => {
                        console.log(err2)
                    })
            }).catch((err1) => {
                console.log(err1)
            })
    }

// //=========================================================================================================// //

    onOrderClick = () => { // //function order
        var userId = this.props.UserId
        var movieId = this.state.datamovie.id
        var pilihan = this.state.pilihan
        var jadwal = this.state.jam
        var studioId = this.props.location.state.studioId
        if(studioId == '4'&&'5'){ // //format harga akhir
            var totalharga = this.state.pilihan.length * 40000
        }
            else{
                var totalharga = this.state.pilihan.length * 25000
        }
        var bayar = false
        var dataorders = {
            userId,
            movieId,
            totalharga,
            jadwal,
            bayar
        }
        Axios.post(`${APIURL}orders`, dataorders) // //meletakan data baru pada db
            .then((res) => { // //apabila axios berhasil dilakukan
                var dataordersdetail = [] // //variable dengan array baru
                pilihan.forEach((val) => { // //melakukan looping pada variable pilihan
                    dataordersdetail.push({ // //melakukan push ke variable dengan array kosong sebelumnya
                        orderId: res.data.id,
                        seat: val.seat,
                        row: val.row
                    })
                })
                console.log(dataordersdetail)
                var dataordersdetail2 = [] // //variable dengan array baru
                dataordersdetail.forEach((val) => { // //melakukan looping pada variable pilihan
                    dataordersdetail2.push(Axios.post(`${APIURL}ordersDetails`, val))
                    // //melakukan push ke variable dengan array kosong sebelumnya, dari db
                })
                Axios.all(dataordersdetail2) // //melakukan mapping pada db
                    .then((res1) => { // //apabila axios berhasil dilakukan
                        console.log(res1)
                        this.setState({ openmodalcart: true }) // //setelah melakukan order, makamodal cart mejadi true (terbuka)
                    }).catch((err) => {
                        console.log(err)
                    })
            }).catch((err) => {
                console.log(err)
            })
    }

// //=========================================================================================================// //

    onButtonjamclick = (val) => { // //function memilih jam
        this.setState({ jam: val, pilihan: [] })
        this.onJamchance()
    }

// //=========================================================================================================// //

    onpilihSeatClick = (row, seat) => { // //function memilih kursi
        var pilihan = this.state.pilihan
        pilihan.push({ row, seat }) // //melakukan push ke variable pilihan dari pilihan kursi
        this.setState({ pilihan })
    }

// //=========================================================================================================// //

    onCancelSeatClick = (row, seat) => { // //function membatalkan pilihan kursi
        var pilihan = this.state.pilihan
        var rows = row
        var seats = seat
        var arr = [] // //variable array kosong untuk menampung data di push
        for (var i = 0; i < pilihan.length; i++) { // //melakukan looping berdasrkan pilihan kursi sebelumnya
            if (pilihan[i].row !== rows || pilihan[i].seat !== seats) { // //kondisi pemilihan kursi yang dibatalkan
                arr.push(pilihan[i]) // //push data ke array kosong
            }
        }
        this.setState({ pilihan: arr }) // //men-setting ulang state berdasarkan perubahan pilihan
    }

// //=========================================================================================================// //

    renderHargaQuantity = () => { // //function harga
        var jumlahtiket = this.state.pilihan.length // //variable yang mengambil banyaknya pilihan
        var studioId = this.props.location.state.studioId
        var harga = jumlahtiket * 25000
        var harga3d = jumlahtiket * 40000
        if(studioId == '4'&&'5'){ // //format harga akhir
            return (
            <div>
                {jumlahtiket}Tiket x {Numeral(40000).format('0,0.00')}={'Rp.' + Numeral(harga3d).format('Rp0,0.00')}
            </div>
            )
        }
            else{
                return(
                <div>
                    {jumlahtiket}Tiket x {Numeral(25000).format('0,0.00')}={'Rp.' + Numeral(harga).format('Rp0,0.00')}
                </div>
                )
        }
    }

// //=========================================================================================================// //

    renderseat = () => { // //function tampilan kursi
        var arr = [] // //variable dengan array kosong yang nantinya akan dipilih oleh user
        
        for (let i = 0; i < this.state.baris; i++) { // //looping dari banyaknya kursi
            arr.push([]) // //melakukan push kepada array kosong
            for (let j = 0; j < this.state.seats / this.state.baris; j++) { // //melakukan looping berdasarkan banyak kursi dan baris
                arr[i].push(1)
            }
        }

        for (let j = 0; j < this.state.booked.length; j++) { // //looping kursi yang sudah dipesan
            arr[this.state.booked[j].row][this.state.booked[j].seat] = 3
        }

        for (let a = 0; a < this.state.pilihan.length; a++) { // //looping kuris yang akan dipesan
            arr[this.state.pilihan[a].row][this.state.pilihan[a].seat] = 2
        }

        var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

        var jsx = arr.map((val, index) => { // //variable tampilan kursi di web
            return (
                <center key={index}>
                    {
                        val.map((val1, i) => {
                            if (val1 === 3) {
                                return (
                                    <button key={i} disabled className='rounded btn btn-disable mr-2 mt-2 bg-danger text-center'>
                                        {alphabet[index] + (i + 1)}
                                    </button>
                                )
                            } else if (val1 === 2) {
                                return (
                                    <button key={i} onClick={() => this.onCancelSeatClick(index, i)} className='rounded btn-order mr-2 mt-2 btn-pilih text-center'>
                                        {alphabet[index] + (i + 1)}
                                    </button>
                                )
                            }
                            return (
                                <button key={i} onClick={() => this.onpilihSeatClick(index, i)} className='rounded btn-order mr-2 mt-2 text-center'>
                                    {alphabet[index] + (i + 1)}
                                </button>
                            )
                        })
                    }
                </center>
            )
        })
        return jsx
    }

// //=========================================================================================================// //

    renderbutton = () => { // //function button pilihan jam
        return this.state.datamovie.jadwal.map((val, index) => {
            if (this.state.jam === val) { // //kondisi jika jam sudah dipilih
                return (
                    <button className='mx-2 btn-outline-primary' disabled>{val}.00</button>
                )
            }
            return ( // //kondisi awal (tanpa ada jam yang dipilih)
                <button className='mx-2 btn-outline-primary' onClick={() => this.onButtonjamclick(val)}>{val}.00</button>
            )
        })
    }

// //=========================================================================================================// //

    render() {
        if (this.props.AuthRole !== "user") { // //proteksi admin (hanya admin yang bisa akses)
            return <NotFound />;
          }

        if (this.props.location.state && this.props.AuthLog) { // //kondisi jika sudah login 
            if (this.state.redirecthome) { // //kondisi redirect ke home
                return <Redirect to={'/'} />
            }
            return (
                <div>
                                                {/* MODAL CART TERBUKA */}
                    <Modal isOpen={this.state.openmodalcart}>
                                                {/* body modal cart */}
                        <ModalBody>
                            Berhasil Ditambahkan
                        </ModalBody>
                                                {/* footer modal cart */}
                        <ModalFooter>
                            <button onClick={() => this.setState({ redirecthome: true })}>Ok</button>
                        </ModalFooter>
                    </Modal>

                    <center className='mt-1'>
                        <div>
                            {this.state.datamovie.title}
                        </div>

                        {this.state.loading ? null : this.renderbutton()}

                        <div>
                            {this.state.pilihan.length ? <button onClick={this.onOrderClick} className='btn btn-primary mt-3'>Buy Now</button>
                                : null}
                        </div>
                        {this.state.pilihan.length ?
                            this.renderHargaQuantity()
                            :
                            null
                        }
                        <div className='d-flex justify-content-center mt-4'></div>
                        <div>
                            {this.state.loading ? null : this.renderseat()}
                        </div>
                        <div style={{ height: '20px', backgroundColor: 'black', color: 'white', textAlign: 'center', marginTop: "10px" }} >Layar </div>
                    </center>
                </div >
            )
        }
        return (
            <div>
                404 Not Found
            </div>
        )
    }
}

const MapstateToprops=(state)=> {
    return {
        AuthLog: state.Auth.login,
        UserId: state.Auth.id,
        AuthRole: state.Auth.role
    }
}

export default connect(MapstateToprops, {keranjangAction})(BeliTiket)