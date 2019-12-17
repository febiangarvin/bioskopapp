import React, { Component } from 'react' // //#15

class NotFound extends Component { // //component jika pada url web tidak sesuai namanya dengan component yang telah dibuat
    render() {
        return (
            <div id="error-page">
                <div id="error-inner">
                    <h1> Sorry, you've got the wrong direction</h1>
                    <div className="pesan-eror">404</div>
                    <p className="balik-home"><a href="/">Next time, ask somebody :D</a></p><br />
                </div>
            </div>
        )
    }
}

export default NotFound