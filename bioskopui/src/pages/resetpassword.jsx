import React, { Component } from "react"; // //#21
import { Button, Form } from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import Slide from "react-reveal/Slide";
import Axios from "axios";
import { APIURL } from "../support/ApiURL";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import { ResetPassAction } from "./../redux/actions";

class ResetPassword extends Component {
    state = { 
        backtohome: false
     }

    //  componentDidMount(){

    //  }

     onClickChangePassword = () => {
        var oldpassword = this.refs.oldpassword.value // //variable untuk nantinya mengambil username
        var newpassword = this.refs.newpassword.value // //variable untuk nantinya mengambil password
        var password = this.refs.confirmpassword.value // //variable untuk mengambil variable password pengulangan
        var updatepassword = { 
            username: this.props.usernamelog,
            password, 
            role: this.props.role
              }; // //variable dengan isi parameter variable sebelumnya
        if (oldpassword === "" || newpassword === "" || password === "") {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Password should not be empty!"
            });
            }
        else if (oldpassword === newpassword) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Your new password should be a new one"
            });
            }
        else if (oldpassword !== this.props.passuser) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Wrong password"
            });
            }
        else if (newpassword !== password) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Your new password does not match"
            });
            }
        else {
            Axios.put(`${APIURL}users/${this.props.userid}`, updatepassword)
                .then(res => {
                Swal.fire({
                    title: "Confirm update?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    cancelButtonText: "No",
                    confirmButtonText: "Yes"
                }).then(result => {
                    if (result.value) {
                    this.props.ResetPassAction(res.data);
                    this.setState({ backtohome: true });
                    Swal.fire({
                        icon: "success",
                        title: "Password has been updated!",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    }
                });
                })
                .catch(err => {
                console.log(err);
                });
            }
        };


        render() {
            if (this.state.backtohome || this.props.userlog === false) {
              return <Redirect to="/" />;
            }
            return (
                <div className=' mt-3 d-flex justify-content-center' style={{marginBottom:60}}>
                    <div style={{width:'500px',border:'1px solid black'}} className='rounded p-2 justify-content-center'>
                        <h1>Change My Password</h1>
                        <label>Username</label>
                        <br/>
                        <div className='p-1' style={{borderBottom:'1px solid black'}}>
                            <input
                                disabled
                                defaultValue={this.props.usernamelog}
                                ref="user"
                            />
                        </div>
                        <br/>
                        <div className='p-1' style={{borderBottom:'1px solid black'}}>
                        <label>Enter your Previous Password</label>
                        <br/>
                            <input placeholder="" type="password" ref="oldpassword" />
                        </div>
                        <br/>
                        <div className='p-1' style={{borderBottom:'1px solid black'}}>
                        <label>Enter a New Password</label>
                        <br/>
                            <input placeholder="" type="password" ref="newpassword" />
                        </div>
                        <br/>
                        <div className='p-1' style={{borderBottom:'1px solid black'}}>
                        <label>Re-enter your New Password</label>
                        <br/>
                            <input placeholder="" type="password" ref="confirmpassword" />
                        </div>
                        <br/>
                        <button className='btn btn-primary' type='submit' onClick={this.onClickChangePassword}>
                            Submit
                        </button>
                    </div>
                </div>
            );
          }
}
 
const MapstateToprops = state => {
    return {
      usernamelog: state.Auth.username,
      userlog: state.Auth.login,
      userid: state.Auth.id,
      passuser: state.Auth.password,
      role: state.Auth.role
    };
  };

  export default connect(MapstateToprops, { ResetPassAction })(ResetPassword);