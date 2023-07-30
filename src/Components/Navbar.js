import React, { Component } from "react";

export class Navbar extends Component {
  render() {
    return (
      <div className="container d-flex align-items-center justify-content-between">
        <img style={{ width: '150px' }} src="./pic/logo.png" alt="logo" />
        <nav id="navbar" className="navbar">
          <ul>
            <li><a className="nav-link scrollto active" href="#hero">Sekilas web</a></li>
            <li><a className="nav-link scrollto" href="#featured-services">Tahapan</a></li>
            <li><a className="nav-link scrollto" href="#inti">Mulai disini!</a></li>
            <li><a className="nav-link scrollto" href="#about">Tentang IqroTech</a></li>
          </ul>
          <i className="bi bi-list mobile-nav-toggle"></i>
        </nav> {/*<!-- .navbar --> */}
      </div>
    )
  }
}