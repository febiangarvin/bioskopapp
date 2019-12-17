import React, { Component } from 'react' // //#14
import Axios from 'axios'
import { connect } from 'react-redux'
// import { Table, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { APIURL } from './../support/ApiURL'
import { Icon, Menu, Table, Popup, Button } from 'semantic-ui-react'
// import { element } from 'prop-types'
import { NotifCart } from '../redux/actions/'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'

class Cart extends Component {
    state = {
        datacart: null, // //buat variable dengan array kosong untuk menampung data pembelian
        modaldetail: false,
        indexdetail: 0,
        detailSeat: []
    }

    // //=========================================================================================================// //

    componentDidMount() { // //render mount data
        Axios.get(`${APIURL}orders?_expand=movie&userId=${this.props.UserId}&bayar=false`) // //mengambil data dari db
            .then((res) => { // //jika Axios berhasil di load
                var datacart = res.data // //variable data pembelian dari data (db)
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
        console.log(this.state.datacart)
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
                        {/* <Table.Cell><button className='btn btn-primary'>Detail</button></Table.Cell> */}
                        <Table.Cell>
                            <Popup
                                position='right center'
                                content={<Table singleLine color='teal' inverted>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Total</Table.HeaderCell>
                                            <Table.HeaderCell>Seat</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>

                                    <Table.Body>

                                        <Table.Row key={index} >
                                            <Table.Cell>{this.state.detailSeat.length}</Table.Cell>
                                            <Table.Cell>{this.state.detailSeat.map((val, i) => {
                                                return val + ', '
                                            })}
                                            </Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>}
                                on='click'
                                pinned
                                trigger={<Button floated='right' color='instagram' size='tiny' onClick={() => this.btnDetail(index)}>Detail</Button>
                                }
                            />
                        </Table.Cell>

                    </Table.Row>
                )
            })
        }
    }

    // //=========================================================================================================// //

    btnDetail = (index) => {
        var id = this.state.datacart[index].id
        Axios.get(`${APIURL}ordersDetails?orderId=${id}`)
            .then(res => {
                var detailfilm = res.data
                var seat = []
                var row = []
                detailfilm.map((val, index) => {
                    seat.push(val.seat)
                    row.push(val.row)
                })
                var abjad = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                var posisi = []
                for (var i = 0; i < seat.length; i++) {
                    for (var j = 0; j < abjad.length; j++) {
                        if (row[i] === j) {
                            posisi.push(String(abjad[j]) + (seat[i] + 1))
                        }
                    }
                } this.setState({ detailSeat: posisi })
            })
    }

    // //=========================================================================================================// //

    render() { // //render akhir
        if (this.props.UserId) {
            return (
                <div className='mt-3 '>
                    {/* <Modal isOpen={this.state.modaldetail} toggle={()=>{this.setState({modaldetail:false})}}>
                    <ModalHeader>
                        Details
                    </ModalHeader>
                    <ModalBody>
                        <Table>
                            <thead>
                                <tr>
                                    <th>
                                        No.
                                    </th>
                                    <th>
                                        Bangku
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.datacart!==null && this.state.datacart.length!==0 ?
                                this.state.datacart[this.state.indexdetail].qty.map((val,index)=>{
                                    return(
                                        <tr key={index}>
                                            <td>{index+1}</td>
                                            <td>{'abcdefghijklmnopqrstuvwxyz'.toUpperCase()[val.row]+[val.seat+1]}</td>
                                        </tr>
                                    )
                                })
                                :
                                null
                                }
                            </tbody>
                        </Table>
                    </ModalBody>
                </Modal> */}
                    <center>
                        <Table celled style={{ width: '70%' }}>
                            {/* header */}
                            <Table.Header>

                                <Table.Row>
                                    <Table.HeaderCell >Order ID</Table.HeaderCell>
                                    <Table.HeaderCell >Title</Table.HeaderCell>
                                    <Table.HeaderCell >Jadwal Tayang </Table.HeaderCell>
                                    <Table.HeaderCell >Jumlah</Table.HeaderCell>
                                    <Table.HeaderCell >Summary</Table.HeaderCell>
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
                                    <Table.HeaderCell colSpan='5'>
                                        <Menu floated='right' pagination>
                                            <Menu.Item as='a' icon>
                                                <Icon size='small' name='chevron left' />
                                            </Menu.Item>
                                            <Menu.Item as='a' icon>
                                                <Icon size='small' name='chevron right' />
                                            </Menu.Item>
                                        </Menu>
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
        keranjang: state.Auth.keranjang
    }
}

export default connect(MapstateToprops)(Cart)