import React from "react";
import { Nav, Button } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import {Link } from "react-router-dom";

function Navbar() {
    return (
      <div>
          <Nav variant="tabs" defaultActiveKey="/home">
            <Nav.Item>
                <Nav.Link href="/home">Search</Nav.Link>
            </Nav.Item>
            {/* <Nav.Item>
                <Nav.Link eventKey="link-1">Library</Nav.Link>
            </Nav.Item> */}
            <Nav.Item>
                <Nav.Link ><Link to="/burnedcds">Burned CDs</Link></Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="link-1">New Cds</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                {/* Maybe delete this */}
                <div className="searchbar">
                <FaSearch />
                    <input type="text" placeholder="What do you want to listen to?"></input>
                </div>
            </Nav.Item>
        </Nav>
      </div>           
    )
}
export default Navbar;