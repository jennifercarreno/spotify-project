import React from "react";
import "./navbar.css";

import { Nav } from "react-bootstrap";
import {Link } from "react-router-dom";
function Navbar() {
    return (
      <div>
          <Nav variant="tabs" defaultActiveKey="/home" className="nav-background">
            <Nav.Item className="item">
                <Nav.Link href="/" class="link"><h4 className="linkText">Home</h4></Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/burnedcds"><h4 className="linkText">Burned CDs</h4></Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="link-1"><h4 className="linkText">New CD</h4></Nav.Link>
            </Nav.Item>
        </Nav>
      </div>           
    )
}
export default Navbar;