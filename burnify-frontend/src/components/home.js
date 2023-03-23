import React, { useState } from 'react';
import axios from 'axios';

const msToMinutesAndSeconds = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

function HomePage() {
    const [search, setSearch] = useState("");
    let [tracks, setTracks] = useState([]);
    
    async function handleSubmit(e) {
		e.preventDefault()
		try {
			const res = await axios.post("http://localhost:3001/search", {
				search
			})
            setTracks(res.data.tracks);
            console.log(res.data.tracks[0])

		} catch (error) {
			console.error(error)
		}
	}
    

    return(
        <div>
            <h3>this is the home page</h3>
            <small>Jennifer's Experiment with the Spotify API</small>
            <form onSubmit={handleSubmit}>

                <input type="text" placeholder="Search for a song..." id="search" name="search" class="col-lg-9 form-control-lg" value={search} onChange={(e) => setSearch(e.target.value)}/>
                <button type="submit" class="btn-outline-primary form-control-lg">Search</button>

            </form>

            <ul>
            {
                tracks.map(({
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
                                    <img src={album.images[0].url} alt="track" />
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
                })
            }
            </ul>
            {/* {home} */}

        </div>
    )
}

export default HomePage;