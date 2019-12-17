import React, { Component } from 'react'; // //#11
import Axios from 'axios'
import { Table, TableBody, TableHead, TableCell, TableRow } from '@material-ui/core'
import { APIURL } from '../support/ApiURL';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import Fade from 'react-reveal/Fade'
import Swal from 'sweetalert2'
// import {Route,Link,Switch} from 'react-router-dom'
import NotFound from '../pages/notfound'
import { connect } from 'react-redux'

class ManageAdmin extends Component {
    state = {
        datafilm: [], // //buat state array kosong untuk menampung data per film
        readmoreselected: -1, // //berguna untuk membuat tombol 'Read More' pada suatu deskripsi film
        modaladd: false, // //berguna untuk add/menambahkan data
        modaledit: false, // //berguna untuk mengubah/edit data
        indexedit: 0, // //sebagai nilai awal urutan array data yang di edit
        jadwal: [12, 14, 16, 18, 20, 22] // //pilihan jam jadwal film
    }

    // //=========================================================================================================// //

    componentDidMount(){
        Axios.get(`${APIURL}movies`)
        .then((res)=>{
            // console.log(res.data)
            Axios.get(`${APIURL}studios`)
            .then(res1=>{
                this.setState({
                    datafilm:res.data,
                    datastudio:res1.data
                })
            })
        }).catch((err)=>{
            console.log(err)
        })
    }


    // //=========================================================================================================// //

    onUpdateDataClick = () => { // //function update data
        var jadwaltemplate = this.state.jadwal // //buat variable template khusus untuk jadwal yang berguna untuk mengambil data/state jadwal
        var jadwal = [] // //buat variable array kosong untuk menampung jadwal film
        var id = this.state.datafilm[this.state.indexedit].id // //buat variable untuk mengambil id dari datafilm yang sedang di edit (diwakili dari index/array)

        for (var i = 0; i < jadwaltemplate.length; i++) { // //buat looping untuk array jadwal template (berdasarkan length jam yang ada)
            if (this.refs[`editjadwal${i}`].checked) { // //dengan kondisi, salah satu jam di check
                jadwal.push(jadwaltemplate[i]) // //maka, akan dilakukan push ke jadwal dari jadwaltemplate yang di check
            }
        }

        var iniref = this.refs // //buat variable untuk mewakili refs (metode pengambilan data di react)
        var title = iniref.edittitle.value // //untuk mengambil value pada data yang diedit, dst.
        var image = iniref.editimage.value
        var sinopsis = iniref.editsinopsis.value
        var sutradara = iniref.editsutradara.value
        var genre = iniref.editgenre.value
        var durasi = iniref.editdurasi.value
        var trailer = iniref.edittrailer.value
        var studioId = iniref.editstudio.value
        var produksi = 'Purwadhika Studios'
        var data = { // //buat variable data yang berisi parameter daripada data itu sendiri (menyesuaikan dengan di db)
            title,
            image,
            sinopsis,
            sutradara,
            genre,
            durasi,
            produksi,
            jadwal,
            trailer,
            studioId
        }

        Axios.put(`${APIURL}movies/${id}`, data) // //dengan Axios.put, maka kita meletakan data yang telah di edit menuju db (localhost)
            .then(() => { // //jika Axios berhasil
                Axios.get(`${APIURL}movies/`) // //kemudian akan mengambil data dari db yang telah di update
                    .then((res) => { // //jika sudah selesai mengambil data yang di update
                        this.setState({ datafilm: res.data, modaledit: false }) // //maka, akan men-setting state terbaru ke variable datafilm, kemudian proses edit (modal) selesai
                    })
            }).catch((err) => {
                console.log(err);
            })
    }

    // //=========================================================================================================// //

    onDeleteClick = (del) => { // //function delete data
        const MySwal = Swal.mixin({ // //menggunakan styling swal fire
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            // buttonsStyling: false
        })

        MySwal.fire({
            title: `Delete ${del.title} ?`, // //warning pertama
            text: "Once you've deleted this, there is no going back",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            reverseButtons: true
        }).then((result) => { // //menampilkan hasil
            if (result.value) {
                Axios.delete(`${APIURL}movies/${del.id}`) // //menghapus data di db
                    .then((res) => { // //jika axios jalan
                        Axios.get(`${APIURL}movies`) // //merender ulang update ter-update
                            .then((res) => { // //jika Axios jalan
                                this.setState({ datafilm: res.data, modaladd: false })
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    }).catch((err) => {
                        console.log(err)
                    })
                MySwal.fire( // //konfirmasi penghapusan
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            } else if ( // //jika user memilih cancel (batal hapus)
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                MySwal.fire(
                    'Cancelled',
                    'Data has been restored',
                    'error'
                )
            }
        })
    }

    // //=========================================================================================================// //

    onSaveAddDataClick = () => { // //function add data
        var jadwaltemplate = [12, 14, 16, 18, 20, 22] // //buat variable yang berisi data jadwal(sesuai dengan state awal)
        var jadwal = [] // //buat variable array kosong untuk menampung jadwal film

        for (var i = 0; i < jadwaltemplate.length; i++) { // //buat looping untuk array jadwal template (berdasarkan length jam yang ada)
            if (this.refs[`jadwal${i}`].checked) { // //dengan kondisi, salah satu jam di pilih/check
                jadwal.push(jadwaltemplate[i]) // //maka, akan dilakukan push ke jadwal dari jadwaltemplate yang di check
            }
        }

        var iniref = this.refs // //buat variable untuk mewakili refs (metode pengambilan data di react)
        var title = iniref.title.value // //untuk mengambil value pada data yang diedit, dst.
        var image = iniref.image.value
        var sinopsis = iniref.sinopsis.value
        var sutradara = iniref.sutradara.value
        var genre = iniref.genre.value
        var durasi = iniref.durasi.value
        var trailer = iniref.trailer.value
        var studioId = iniref.studio.value
        var produksi = 'Purwadhika Studios'
        var data = { // //buat variable data yang berisi parameter daripada data itu sendiri (menyesuaikan dengan di db)
            title,
            image,
            sinopsis,
            sutradara,
            genre,
            durasi,
            produksi,
            jadwal,
            trailer,
            studioId
        }

        Axios.post(`${APIURL}movies`, data) // //dengan Axios.post, maka kita menambahkan data di directory db
            .then(() => { // //jika Axios berhasil
                Axios.get(`${APIURL}movies`) // //kemudian akan mengambil data dari db yang telah di update
                    .then((res) => { // //jika sudah selesai mengambil data yang di update
                        this.setState({ datafilm: res.data, modaladd: false }) // //maka, akan men-setting state terbaru ke variable datafilm, kemudian proses add (modal) selesai
                    })
                    .catch((err) => { // //apabila Axios gagal loading
                        console.log(err);
                    })
            }).catch((err) => { // //apabila Axios gagal loading
                console.log(err);
            })
    }

    // //=========================================================================================================// //

    renderMovies = () => { // //membuat tampilan film di web
        return this.state.datafilm.map((val, index) => { // //mengembalikan hasil data film yang di map dari db
            return (
                <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{val.title}</TableCell>
                    <TableCell><img src={val.image} alt={'gambar'} height='200px' /></TableCell>
                    {/* buat sebuah kondisi tampilan sesuai dengan pilihan user. Apakah mau menampilkan sinposis atau tidak */}
                    {this.state.readmoreselected === index ?
                        <TableCell width='350px'>
                            {val.sinopsis}
                            <span style={{ color: 'red' }} onClick={() => this.setState({ readmoreselected: -1 })}>
                                Read less
                                </span>
                        </TableCell>
                        :
                        <TableCell width='350px'>
                            {val.sinopsis.split('').filter((val, index) => index <= 80)}
                            <span style={{ color: 'red' }} onClick={() => this.setState({ readmoreselected: index })}>
                                Read More
                            </span>
                        </TableCell>
                    }
                    <TableCell>{val.jadwal}</TableCell>
                    <TableCell>{val.sutradara}</TableCell>
                    <TableCell>{val.genre}</TableCell>
                    <TableCell>{val.durasi}</TableCell>
                    <TableCell>
                        {/* tombol untuk memulai kegiatan edit */}
                        <button className='btn btn-outline-primary mr-3' onClick={() => this.setState({ modaledit: true, indexedit: index })}>Edit</button>
                        {/* tombol untuk menghapus film */}
                        <button className='btn btn-outline-danger' onClick={() => this.onDeleteClick(val)}>Delete</button>
                    </TableCell>
                </TableRow>
            )
        })
    }

    // //=========================================================================================================// //

    renderEditCheckbox = (indexedit) => {
        var indexarr = [] // //buat variable array kosong untuk menampung data
        var datafilmedit = this.state.datafilm[indexedit].jadwal // //variable untuk mengubah data film berdasarkan jadwal film yang dipilih untuk di edit
        console.log(datafilmedit);
        for (var i = 0; i < datafilmedit.length; i++) { // //melakukan looping, berdasarkan film yang dipilih untuk di edit
            for (var j = 0; j < this.state.jadwal.length; j++) { // //melakukan looping namun menampilkan pilihan jam yang telah di render sebelumnya
                if (datafilmedit[i] === this.state.jadwal[j]) { // //jika ada pilihan jam yang di check
                    indexarr.push(j) // //maka pilihan tersebut akan di push ke dalam array kosong yang telah dibuat sebelumnya
                }
            }
        }
        var checkbox = this.state.jadwal // //buat variable dengan mengambil data dari jadwal
        var checkboxnew = [] // //buat variable dengan array kosong untuk menampung
        checkbox.forEach((val) => { // //karena ingin mengambil seluruh data dalam array, gunakan forEach
            checkboxnew.push({ jam: val, tampiledit: false }) // //lalu akan di push ke dalam array kosong yang telah dibuat yang berisi value jam
        })
        indexarr.forEach((val) => { // //buat looping forEach untuk mengambil seluruh data dari index array (array koosng yang telah diisi)
            checkboxnew[val].tampiledit = true // //maka, akan merubah status tampil edit menjadi true
        })
        return checkboxnew.map((val, index) => { // //mengembalikan hasil checkbox terbaru yang melakukan map kepada value dan index tersebut
            if (val.tampiledit) { // //kondisi jika tampiledit = true
                return (
                    <div key={index}>
                        <input type="checkbox" defaultChecked ref={`editjadwal${index}`} value={val.jam} />
                        <span className='mr-2'>{val.jam}.00</span>
                    </div>
                )
            } else { // //kondisi jika tampiledit = false
                return (
                    <div key={index}>
                        <input type="checkbox" ref={`editjadwal${index}`} value={val.jam} />
                        <span className='mr-2'>{val.jam}.00</span>
                    </div>
                )
            }
        })
    }

    // //=========================================================================================================// //

    renderAddCheckbox = () => { // //membuat function untuk render add
        return this.state.jadwal.map((val, index) => { // //mengembalikan hasil dari jadwal yang melakukan map value dan index
            return (
                <div key={index}>
                    {/* mengambil referensi dari index array (isis) jadwal */}
                    <input type="checkbox" ref={`jadwal${index}`} />
                    <span className='mr-2'>{val}.00</span>
                </div>
            )
        })
    }

    // //=========================================================================================================// //

    render() {
        const { datafilm, indexedit } = this.state // //menggunakan variable data dan index edit dari state
        const { length } = datafilm // //menggunakan length dari data film (array)
        if (this.props.AuthRole !== "admin") { // //proteksi admin (hanya admin yang bisa akses)
            return <NotFound />;
        }

        if (length === 0) { // //kondisi apabila length (data ter-render) yang muncul 0
            return <div>Loading...</div> // //akan muncul loading
        }

        return (
            <div className='mx-3'>
                {/* MEMBUKA MODAL EDIT */}
                <Modal isOpen={this.state.modaledit} toggle={() => this.setState({ modaledit: false })}>

                    {/* header modal edit */}

                    <ModalHeader>
                        {/* memunculkan judul data yang akan di edit */}
                        Edit Data {datafilm[indexedit].title}
                    </ModalHeader>

                    {/* body modal edit */}

                    <ModalBody>
                        {/* edit title */}
                        <input type="text" defaultValue={datafilm[indexedit].title} ref='edittitle' placeholder='title' className='form-control mt-2' />
                        {/* edit image */}
                        <input type="text" defaultValue={datafilm[indexedit].image} ref='editimage' placeholder='image' className='form-control mt-2' />
                        {/* edit sinposis */}
                        <textarea rows='5' ref='editsinopsis' defaultValue={datafilm[indexedit].sinopsis} placeholder='sinopsis' className='form-control mt-2 mb-2' />
                        Jadwal:
                        <div className="d-flex">
                            {/* edit jadwal berdasarkan render edit yang telah dibuat sebelumnya */}
                            {this.renderEditCheckbox(indexedit)}
                        </div>
                        {/* edit trailer */}
                        <input type="text" defaultValue={datafilm[indexedit].trailer} ref='edittrailer' placeholder='trailer' className='form-control mt-2' />
                        {/* edit pilihan studio ke berapa */}
                        <select ref='editstudio' className='form-control mt-2'>
                            {
                                this.state.datastudio.map((val) => {
                                    return (
                                        <option value={val.id}>{val.nama}</option>
                                    )
                                })
                            }
                        </select>
                        {/* edit sutradara */}
                        <input type="text" defaultValue={datafilm[indexedit].sutradara} ref='editsutradara' placeholder='sutradara' className='form-control mt-2' />
                        {/* edit durasi film */}
                        <input type="number" defaultValue={datafilm[indexedit].durasi} ref='editdurasi' placeholder='durasi' className='form-control mt-2' />
                        {/* edit genre film */}
                        <input type="text" defaultValue={datafilm[indexedit].genre} ref='editgenre' placeholder='genre' className='form-control mt-2' />
                    </ModalBody>

                    {/* footer modal edit */}

                    <ModalFooter>
                        {/* button save edit */}
                        <button onClick={this.onUpdateDataClick} >Save</button>
                        {/* button cancel edit */}
                        <button onClick={() => this.setState({ modaledit: false })}>Cancel</button>
                    </ModalFooter>
                </Modal>

                {/* MEMBUKA MODAL ADD */}
                <Modal isOpen={this.state.modaladd} toggle={() => this.setState({ modaladd: false })}>

                    {/* header modal add */}

                    <ModalHeader>
                        Add Data
                    </ModalHeader>

                    {/* body modal add*/}

                    <ModalBody>
                        {/* add title */}
                        <input type="text" ref='title' placeholder='title' className='form-control mt-2' />
                        {/* add image */}
                        <input type="text" ref='image' placeholder='image' className='form-control mt-2' />
                        {/* add sinopsis */}
                        <input type="text" ref='sinopsis' placeholder='sinopsis' className='form-control mt-2 mb-2' />
                        Jadwal:
                        <div className="d-flex">
                            {/* add jadwal dengan render yang telah dibuat */}
                            {this.renderAddCheckbox()}
                        </div>
                        {/* add trailer */}
                        <input type="text" ref='trailer' placeholder='trailer' className='form-control mt-2' />
                        {/* add studio yang dipilih */}
                        <select ref='studio' className='form-control mt-2'>
                            {
                                this.state.datastudio.map((val) => {
                                    return (
                                        <option value={val.id}>{val.nama}</option>
                                    )
                                })
                            }
                        </select>
                        {/* add sutradara */}
                        <input type="text" ref='sutradara' placeholder='sutradara' className='form-control mt-2' />
                        {/* add durasi film */}
                        <input type="number" ref='durasi' placeholder='durasi' className='form-control mt-2' />
                        {/* add genre film */}
                        <input type="text" ref='genre' placeholder='genre' className='form-control mt-2' />
                    </ModalBody>

                    <ModalFooter>
                        {/* button save */}
                        <button onClick={this.onSaveAddDataClick}>Save</button>
                        {/* button cancel */}
                        <button onClick={() => this.setState({ modaladd: false })}>Cancel</button>
                    </ModalFooter>
                </Modal>

                <Fade>
                    <button className='btn btn-success' onClick={() => this.setState({ modaladd: true })}> Add a Film</button>
                    <Table size='small' >
                        <TableHead>
                            <TableRow>
                                <TableCell>No.</TableCell>
                                <TableCell>Judul</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Sinopsis</TableCell>
                                <TableCell>Jadwal</TableCell>
                                <TableCell>Sutradara</TableCell>
                                <TableCell>Genre</TableCell>
                                <TableCell>Durasi</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.renderMovies()}
                        </TableBody>
                    </Table>
                </Fade>
            </div>
        );
    }
}

const MapstateToprops = (state) => { // //melakukan map state ke props
    return {
        AuthLog: state.Auth.login,
        AuthRole: state.Auth.role
    }
}

export default connect(MapstateToprops)(ManageAdmin);