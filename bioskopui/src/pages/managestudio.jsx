import React, { Component } from 'react'; // //#22
import { Table, TableBody, TableHead, TableCell, TableRow } from '@material-ui/core'
import Axios from 'axios'
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap'
import Jump from 'react-reveal/Jump'
import { APIURL } from '../support/ApiURL';
import Swal from 'sweetalert2'
import NotFound from '../pages/notfound'
import { connect } from 'react-redux'

class ManageStudio extends Component {
    state = {
        dataStudio: [],
        modalAdd: false,
        modalEdit: false,
        modalDelete: false,
        loading: true,
        indexDelete: 0,
        indexEdit: 0
    }

// //=========================================================================================================// //

    componentDidMount() { // //mengambil data studios dari db
        Axios.get(`${APIURL}studios`)
            .then((res) => {
                var data = res.data
                this.setState({ dataStudio: res.data, loading:false })
            })
            .catch((err) => {
                console.log(err)
            })
    }

// //=========================================================================================================// //

    onSaveAddDataClick = () => { // //function untuk add studio
        var studio = this.refs.studio.value
        var jumlahKursi = this.refs.kursi.value

        var data = {
            nama: studio,
            jumlahKursi
        }

        if (studio === '') { // //peringatan apabila ada field yang kosong
            Swal.fire({
                title: 'Please fill the name of the studio',
                input: 'nama',
                icon: 'error'
            })
        }
        if (jumlahKursi === '') {
            Swal.fire({
                title: 'Please fill the total seats of the studio',
                input: 'jumlahKursi',
                icon: 'error'
            })
        }
        else {
            Axios.post(`${APIURL}studios`, data)
                .then((res) => {
                    Axios.get(`${APIURL}studios`)
                        .then((res) => {
                            this.setState({ dataStudio: res.data, modalAdd: false })
                            Swal.fire(
                                'A new studio has been added!',
                                'Click OK to proceed',
                                'success'
                            )
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

// //=========================================================================================================// //

    onEditDataClick=(indexEdit)=>{ // //function edit studio
        // var iniref=this.refs
        var id=this.state.dataStudio[this.state.indexEdit].id
        var studio=this.refs.editnama.value
        var jumlahKursi=this.refs.editkursi.value
        
        var data={
            nama: studio,
            jumlahKursi
        }
        
        Axios.put(`${APIURL}studios/${id}`, data) // //menaruh hasil edit ke axios (db)
        .then(()=>{ // //jika axios berhasil
            Axios.get(`${APIURL}studios/`) // //lalu merender ulang data yang diambil dari db
            .then((res)=>{
                this.setState({dataStudio:res.data, modalEdit:false}) // //membuat konfirmasi
                Swal.fire(
                    'The studio has been edited',
                    'Click OK to proceed',
                    'success'
                )
            })
            .catch((err)=>{
                console.log(err)
            })
        }).catch((err)=>{
            console.log(err)
        })
    }

// //=========================================================================================================// //

    onDeleteDataClick = (indexDelete) => { // //function delete studio
        var id = this.state.dataStudio[this.state.indexDelete].id
        Axios.delete(`${APIURL}studios/${id}`) // //menghapus data dari db
            .then(() => { // //jika axios berhasil
                Axios.get(`${APIURL}studios`) // //merender ulang data dari db
                    .then((res) => {
                        this.setState({ dataStudio: res.data, modalDelete: false }) // //konfirmasi hapus studio
                        Swal.fire(
                            'The studio has been deleted',
                            'Click OK to proceed',
                            'success'
                        )
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })
            .catch((err) => {
                console.log(err)
            })
    }

// //=========================================================================================================// //

    renderStudios = () => { // //merender tampilan studio
        return this.state.dataStudio.map((val, index) => {
            return (
                <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{val.nama}</TableCell>
                    <TableCell>{val.jumlahKursi}</TableCell>
                    <TableCell>
                        <button className='btn btn-success mr-1 ml-1' onClick={() => { this.setState({ modalEdit: true, indexEdit: index }) }}>EDIT</button>
                        <button className='btn btn-danger mr-1 ml-1' onClick={() => { this.setState({ modalDelete: true, indexDelete: index }) }}>DELETE</button>
                    </TableCell>
                </TableRow>
            )
        })
    }

// //=========================================================================================================// //

    render() { // //render akhir
        const length = this.state.dataStudio
        if (this.props.AuthRole !== "admin") { // //proteksi admin (hanya admin yang bisa akses)
            return <NotFound />;
        }

        if (length === 0) {
            return <div>Loading...</div>
        }
        return (
            <div className='mx-3'>
                {/* OPEN MODAL ADD */}
                <Modal isOpen={this.state.modalAdd} toggle={() => this.setState({ modalAdd: false })}>
                    <ModalHeader>
                        Add Data Studio
                    </ModalHeader>
                    <ModalBody>
                        <input type="text" ref="studio" placeholder='Nama Studio' className="form-control mt-2" />
                        <input type="number" ref="kursi" placeholder='Jumlah Kursi Per Studio' className="form-control mt-2" />
                    </ModalBody>
                    <ModalFooter>
                        <button className='btn btn-success mt-2' onClick={this.onSaveAddDataClick}>ADD</button>
                        <button className='btn btn-warning mt-2' onClick={() => { this.setState({ modalAdd: false }) }}>CANCEL</button>
                    </ModalFooter>
                </Modal>
                {/* OPEN MODAL EDIT */}
                <Modal isOpen={this.state.modalEdit} toggle={()=>this.setState({modalEdit:false})}>
                    <ModalHeader>
                        Edit Data Studios
                    </ModalHeader>
                    <ModalBody>
                        <input type="text" ref='editnama'  placeholder='Nama Studio' className='form-control mt-2'/>
                        <input type="number" ref='editkursi' placeholder='Jumlah Kursi Per Studio' className='form-control mt-2'/>
                    </ModalBody>
                    <ModalFooter>
                        <button variant="success" onClick={this.onEditDataClick}>SAVE</button>
                        <button variant="danger" onClick={()=>this.setState({modalEdit:false})}>CANCEL</button>
                    </ModalFooter>
                </Modal>
                {/* OPEN MODAL DELETE */}
                <Modal isOpen={this.state.modalDelete} toggle={() => this.setState({ modalDelete: false })}>
                    <ModalHeader>
                        Delete Data
                        </ModalHeader>
                    <ModalBody>
                        <h3 style={{ color: 'black', alignContent: 'center' }}>Are you sure you want to delete this?</h3>
                    </ModalBody>
                    <ModalFooter>
                        <button className='btn btn-danger mr-2' onClick={this.onDeleteDataClick}>DELETE DATA</button>
                        <button className='btn btn-success' onClick={() => { this.setState({ modalDelete: false }) }}>CANCEL</button>
                    </ModalFooter>
                </Modal>
                {/* TAMPILAN DI WEB */}
                <Jump>
                    <center>
                        <button className='btn btn-success my-2' onClick={() => { this.setState({ modalAdd: true }) }}>ADD STUDIO</button>
                    </center>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>No. </TableCell>
                                <TableCell>Nama Studio</TableCell>
                                <TableCell>Jumlah Kursi</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.renderStudios()}
                        </TableBody>
                    </Table>
                </Jump>
            </div>
        );
    }
}

// //=========================================================================================================// //

const MapstateToprops = (state) => { // //melakukan map state ke props
    return {
        AuthLog: state.Auth.login,
        UserId:state.Auth.id,
        AuthRole: state.Auth.role
    }
}

export default connect(MapstateToprops)(ManageStudio);