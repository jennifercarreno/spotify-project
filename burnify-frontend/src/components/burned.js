import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Container } from 'react-bootstrap';
import "./burned.css"

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
        <h3>burned cd page</h3>
            <ul>
                <Container>
                <Row>
            {
            cds.map((cd, id) => {return(
                    <Col>
                        <div>
                    <Card style={{ width: '20rem' }}>
                        <Card.Img alt="playlist cover" src={cd.tracks[0].album.images[2].url}/>
                        <Card.Body>
                            <Card.Title>{cd.title}</Card.Title>
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