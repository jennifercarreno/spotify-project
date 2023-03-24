import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Container } from 'react-bootstrap';
import "./burned.css"
import { Link } from 'react-router-dom';
import Navbar from './navbar';

function BurnedCDs() {
    let [cds, setCds] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/playlists')
        .then(res => {
            // const cds = res.data;
            console.log(res.data);
            setCds(res.data.displayed_playlists);
            
        })
    }, [])
    console.log(cds);
    return (
        <div>
            <Navbar />
            <ul>
                <Container>
                <Row xxl={{cols:12}}>
            {
            cds.map((cd, id) => {return(
                    <Col style={{margin:"0px"}} xxl={3}>
                        <div>
                            {/* style={{width:"10rem", margin:"20px"}} */}
                    <Card style={{width:"10rem", margin:"20px"}} className="card">
                        <Card.Img alt="playlist cover" src={cd.tracks[0].album.images[1].url}/>
                        <Card.Body className="playlist-card">
                            <Card.Title ><Link
                                to={"/cd"}
                                state={{ id: cd._id }}><h4 className="cardTitle">{cd.title}</h4>

                                </Link></Card.Title>
                            <Card.Text>
                            Created By: {cd.created_by.username}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    </div>
                    </Col>
                 

            )})
            }
            </Row>
            </Container>
        </ul>

      </div>
    )
}

export default BurnedCDs