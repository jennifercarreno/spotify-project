import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { AiFillClockCircle } from "react-icons/ai"
import "./cd.css"
import Navbar from "./navbar";
import { Container, Button } from "react-bootstrap";

export default function Cd() {
    // console.log(useLocation())
    const { state } = useLocation()
    let [playlist, setPlaylist] = useState([]);
    let [tracks, setTracks] = useState([]);

    const msToMinutesAndSeconds = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
      };

    useEffect(() => {
        axios.get(`http://localhost:3001/playlist/${state.id}`)
        .then(res => {
            // const cds = res.data;
            console.log(res.data.playlist);
            setPlaylist(res.data.playlist);
            setTracks(res.data.playlist.tracks);
            
        })
    })
    return(
        <div>
       <Navbar />

        <Container >
                <div className="playlist">
                    <div className="coverImage">
                        <img src={tracks[0]?.album.images[1].url} alt="playlist" />
                    </div>
                    <div className="details">
                        <span className="type">PLAYLIST</span>
                        <h1 className="title">{playlist.title}</h1>
                        <p className="description">{playlist.description}</p>
                        <Button className="spotify-button"><a href={playlist.playlist_url}>Open in Spotify</a></Button>{' '}
                    </div>
                </div>
                <div className="list">
                    <div className="header_row">
                        <div className="col">
                            <span>#</span>
                        </div>
                        <div className="col">
                            <span>TITLE</span>
                        </div>
                        <div className="col">
                            <span>ALBUM</span>
                        </div>
                        <div className="col">
                            <span><AiFillClockCircle /></span>
                        </div>
                    </div>
                    <div>
                        {playlist.tracks?.map(
                            ({
                                id,
                                name,
                                artists,
                                duration_ms,
                                album,

                            }, index) => {
                                return (
                                    <div className="row" key={id}>
                                        <div className="col">
                                            <span>{index + 1}</span>
                                        </div>
                                        <div className="col detail">
                                            <div className="image">
                                                <img src={album.images[1].url} alt="track" />
                                            </div>
                                            <div className="info">
                                                <span className="name">{name}</span>
                                                <span>{artists[0].name}</span>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <span>{album.name}</span>
                                        </div>
                                        <div className="col">
                                            <span>{msToMinutesAndSeconds(duration_ms)}</span>
                                        </div>
                                    </div>
                                )
                            }
                        )}
                    </div>
                </div>
                </Container>
        </div>
    )
}