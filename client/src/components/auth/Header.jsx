import React from 'react'
import "../../index.css"

const Header = () => {
  return (
    <div className='header-flex'>
        <center>
            <h1>Welcome to Rooms</h1>
            <p>
                Share messages, images and files with your friends as much as you
                want.
            </p>
        </center>
        <div className='header-img-container'>
            <img src='/logo.png' style={{
                height: "90px",
                width: "auto"
            }}/>
        </div>

    </div>
  )
}

export default Header
