import React, { Component } from 'react' // //#12
import { Button, Form } from 'semantic-ui-react'
import Axios from 'axios'
import { APIURL } from '../support/ApiURL'
import Swal from 'sweetalert2'

class Register extends Component {
    state = {
    }

// //=========================================================================================================// //

    onClickRegister = () => {
        var username = this.refs.username.value // //variable untuk nantinya mengambil username
        var password = this.refs.pass.value // //variable untuk nantinya mengambil password
        var confirmpass = this.refs.confirmpass.value // //variable untuk mengambil variable password pengulangan
        var role = "user" // //karena register khusus untuk user, maka role di setting untuk user
        var newUser = { username, password, role } // //variable dengan isi parameter variable sebelumnya
        // console.log(password, confirmpass)
        if (username === '' || password === '' || confirmpass === '') { // //kondisi jika salah satu variable ada yang kosong
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Mohon lengkapi registrasi'
            })
        } else { // //kondisi jika register sudah terpenuhi
            Axios.get(`${APIURL}users?username=${username}`) // //mengambil data dari db
                .then(res1 => { // //jika axios berhasil dilakukan
                    // console.log(res1)
                    if (res1.data.length === 0) {
                        if (password !== confirmpass) { // //kondisi jika password tidak sama dengan password konfirmasi
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Password Tidak Yang Diinput Tidak Sesuai',
                            })
                        } else { // //jika sudah sesuai
                            Axios.post(`${APIURL}users`, newUser) // //melakukan posting ke db
                                .then(res => {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Sukses !',
                                        text: 'Selamat Bergabung! Silahkan Login Ulang!',
                                    })
                                    this.props.history.push('login') // //melakukan push ke props 
                                })
                                .catch(err1 => {
                                    console.log(err1)
                                })
                        }
                    } else { // //kondisi jika nama username sudah terdaftar sebelumnya
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'User Sudah Terdaftar',
                        })
                    }
                }).catch(err1 => {
                    console.log(err1)
                })
        }
    }

// //=========================================================================================================// //

    render() { // //render tampilan registrasi
        return (
            <div className=' mt-3 d-flex justify-content-center'>
                <div style={{width:'500px',border:'1px solid black'}} className='rounded p-2'>
                    <h1>REGISTER</h1>
                    <div className='p-1' style={{borderBottom:'1px solid black'}}>
                        <input type="text" ref='username' style={{border:'transparent',width:'100%',fontSize:'20px'}} ref='username' placeholder='Insert Username'/>
                    </div>
                    <br/>
                    <div className='p-1' style={{borderBottom:'1px solid black'}}>
                        <input type="password" ref='pass' style={{border:'transparent',width:'100%',fontSize:'20px'}} placeholder='Insert Password'/>
                    </div>
                    <br/>
                    <div className='p-1' style={{borderBottom:'1px solid black'}}>
                        <input type="password" ref='confirmpass' style={{border:'transparent',width:'100%',fontSize:'20px'}} placeholder='Insert Password'/>
                    </div>
                    <br/>
                    <button className='btn btn-primary' type='submit' onClick={this.onClickRegister}>Register</button>
                </div>
            </div>
        )
    }
}

export default Register

                        {/* <div className='container mt-auto' style={{ width: '30%' }} >
                            <Form className=' mt-3 justify-content-center'>
                                <h1>REGISTER</h1>
                                <Form.Field>
                                    <label>User Name</label>
                                    <input ref='username' placeholder='username' />
                                </Form.Field>
                                <Form.Field>
                                    <label>Password</label>
                                    <input ref='pass' type='password' placeholder='password' />
                                </Form.Field>
                                <Form.Field>
                                    <label>Confirm Password</label>
                                    <input ref='confirmpass' type='password' placeholder='password' />
                                </Form.Field>
                                <Button color='green' type='submit' onClick={this.onClickRegister}>Register</Button>
                            </Form>
                        </div> */}