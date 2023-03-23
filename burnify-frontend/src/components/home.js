import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HomePage({token}) {
    // const [ home, setHome ] = useState("")
    const [search, setSearch] = useState("");
    let [tracks, setTracks] = useState([]);

	// useEffect(() => {
	// 	axios.get("http://localhost:3001/home").then(function(response) {
	// 		setHome(response.data)
    //         console.log(response)
	// 	})
	// }, [])
    
    async function handleSubmit(e) {
		e.preventDefault()
		try {
			const res = await axios.post("http://localhost:3001/search", {
				search
			})
            setTracks(res.data.tracks);
            // setTracks = res.data.tracks.map(({name, id}) => {return {name, id}});
            console.log("Tracks: " + tracks[0].name)

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
                tracks.map(({name, id}) => {
                    console.log({name})
                    return (<li key={id}>{name}</li>)
                })
            }
            </ul>
            {/* {home} */}

        </div>
    )
}

export default HomePage;