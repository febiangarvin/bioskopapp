import React, { Component } from 'react' // //#14
import Axios from 'axios'
import { connect } from 'react-redux'
import { APIURL } from './../support/ApiURL'
import { Icon, Menu, Table, Popup, Button } from 'semantic-ui-react'
import { totalHargaAction } from '../redux/actions'
// import { Table, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
// import { element } from 'prop-types'
// import { NotifCart } from '../redux/actions/'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import NotFound from '../pages/notfound'

class Cart extends Component {
    state = {
        datacart: null, // //buat variable dengan array kosong untuk menampung data pembelian
        modaldetail: false,
        modaldelete: false,
        modalindex: '',
        indexdetail: 0,
        detailSeat: []
    }

    // //=========================================================================================================// //

    componentDidMount() { // //render mount data
        Axios.get(`${APIURL}orders?_expand=movie&userId=${this.props.UserId}&bayar=false`) // //mengambil data dari db
            .then((res) => { // //jika Axios berhasil di load
                var datacart = res.data // //variable data pembelian dari data (db)
                var harga = 0
                for (var i = 0; i < datacart.length; i++) {
                    harga += datacart[i].totalharga
                }
                this.setState({ totalharga: harga })
                var qtyarr = [] // //buat variable array kosong untuk menampung metode push
                res.data.forEach(element => { // //melakukan looping untuk array data cart
                    qtyarr.push(Axios.get(`${APIURL}ordersDetails?orderId=${element.id}`))
                    // //melakukan push ke data array kosong yang sudah dibuat sebelumnya
                })
                var qtyarrfinal = [] // //buat variable array kosong lagi untuk menampung metode push data
                Axios.all(qtyarr) // //melakukan map untuk data sebelumnya (yang sudah di push)
                    .then((res1) => { // //jika data sudah di load dari metode axios
                        res1.forEach((val) => { // //melakukan looping dari data sebelumnya
                            qtyarrfinal.push(val.data) // //push data ke array kosong sebelumnya
                        })
                        // console.log(qtyarrfinal)
                        var datafinal = [] // //variable array kosong untuk menampung data akhir
                        datacart.forEach((val, index) => { // //melakukan looping dari data pembelian
                            datafinal.push({ ...val, qty: qtyarrfinal[index] })
                            // //melakukan push ke array data final (array kosong), yang berisi jumlah akhir pembelian
                        })
                        // console.log(datafinal)
                        this.setState({
                            datacart: datafinal
                        })
                    }).catch((err1) => {
                        console.log(err1)
                    })
            }).catch((err) => {
                console.log(err)
            })
    }

    // //=========================================================================================================// //

    renderCart = () => { // //function render pembelian
        if (this.state.datacart !== null) { // //kondisi jika belum melakukan pembelian
            if (this.state.datacart.length === 0) {
                return (
                    <tr>
                        <td>Your cart is still empty</td>
                    </tr>)
            }
            return this.state.datacart.map((val, index) => { // //mengambil data cart (dari function Mount)
                return (
                    <Table.Row>
                        <Table.Cell>{index + 1}</Table.Cell>
                        <Table.Cell>{val.movie.title}</Table.Cell>
                        <Table.Cell><Icon name='wait' /> {val.jadwal}:00</Table.Cell>
                        <Table.Cell>{val.qty.length}</Table.Cell>
                        <Table.Cell>
                            <button className='mt-2 mb-2 mr-2 btn btn-info' onClick={() => this.setState({ modaldetail: true, modalindex: index })}>Detail</button>
                            {/* <button className='mt-2 mb-2 btn btn-danger' onClick={()=>this.setState({modaldelete:true,datadelete:val})}>Delete</button> */}
                        </Table.Cell>
                        {/* OPEN MODAL DETAIL FILM */}
                        <Modal isOpen={this.state.modaldetail} toggle={() => this.setState({ modaldetail: false })} size='sm'>
                            <ModalHeader>
                                {this.state.modalindex !== '' ?
                                    this.detailhead()
                                    :
                                    null
                                }
                            </ModalHeader>
                            <ModalBody>
                                <center>
                                    <table>
                                        <thead>
                                            <tr>
                                                <td style={{ width: '50px' }}><center>No.</center></td>
                                                <td style={{ width: '100px' }}><center>Seat</center></td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.modalindex !== '' ?
                                                this.state.datacart[this.state.modalindex].qty.map((val, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td style={{ width: '50px' }}><center>{index + 1}</center></td>
                                                            <td style={{ width: '100px' }}><center>{'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[val.row]} {val.seat + 1}</center></td>
                                                        </tr>
                                                    )
                                                })
                                                :
                                                null
                                            }
                                        </tbody>
                                    </table>
                                </center>
                            </ModalBody>
                        </Modal>
                    </Table.Row>
                )
            })
        }
    }

    // //=========================================================================================================// //

    detailhead = () => { // //function untuk menampilkan keterangan di head detail
        return (
            <div>Order Detail Number: {this.state.datacart[this.state.modalindex].id} </div>
        )
    }

    // //=========================================================================================================// //

    btnDetail = (index) => { // //function button detail
        var id = this.state.datacart[index].id // //membuat variable untuk mengambil state dari data cart
        Axios.get(`${APIURL}ordersDetails?orderId=${id}`) // //mengambil data order dari db
            .then(res => { // //jika axios berhasil
                var detailfilm = res.data
                var seat = []
                var row = []
                detailfilm.map((val, index) => {
                    seat.push(val.seat)
                    row.push(val.row)
                })
                var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                var posisi = []
                for (var i = 0; i < seat.length; i++) { // //looping tampilan tempat duduk
                    for (var j = 0; j < alphabet.length; j++) {
                        if (row[i] === j) {
                            posisi.push(String(alphabet[j]) + (seat[i] + 1))
                        }
                    }
                } this.setState({ detailSeat: posisi })
            })
    }

    // //=========================================================================================================// //

    render() { // //render akhir
        this.props.totalHargaAction(this.state.totalharga)

        if (this.props.AuthRole !== "user") { // //proteksi user (hanya user yang bisa akses)
            return <NotFound />;
        }

        if (this.props.UserId) {
            return (
                <div className='mt-5'>
                    <center>
                        <Table color='grey' inverted celled style={{ width: '70%', height: '100px' }} >
                            {/* header */}
                            <Table.Header>

                                <Table.Row>
                                    <Table.HeaderCell >Order ID</Table.HeaderCell>
                                    <Table.HeaderCell >Title</Table.HeaderCell>
                                    <Table.HeaderCell >Jadwal Tayang </Table.HeaderCell>
                                    <Table.HeaderCell >Jumlah</Table.HeaderCell>
                                    <Table.HeaderCell >Action</Table.HeaderCell>
                                </Table.Row>

                            </Table.Header>
                            {/* body */}
                            <Table.Body>
                                {/* render dari function render cart */}
                                {this.renderCart()}
                            </Table.Body>
                            {/* footer */}
                            <Table.Footer>
                                <Table.Row>
                                    <Table.HeaderCell colSpan='6' floated='center'>
                                        {/* button untuk checkout */}
                                        <Button size='large' animated='vertical' color='instagram' inverted style={{ marginLeft: '841px' }}>
                                            <Button.Content hidden>Checkout</Button.Content>
                                            <Button.Content visible>
                                                Total Rp {this.props.totalharga}
                                            </Button.Content>
                                        </Button>
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Footer>
                        </Table >
                    </center>
                </div >
            )
        } return (
            <div>404 Not Found</div>
        )
    }
}

const MapstateToprops = (state) => {
    return {
        AuthLog: state.Auth.login,
        UserId: state.Auth.id,
        AuthRole: state.Auth.role,
        keranjang: state.Auth.keranjang,
        totalharga: state.Auth.totalharga
    }
}


export default connect(MapstateToprops, { totalHargaAction })(Cart)