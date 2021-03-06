import React, { useEffect, useState } from 'react';
import axios from '../API/axios';
import "./Row.css";
import Youtube from 'react-youtube';
import movieTrailer from 'movie-trailer';

const baseURL = 'https://image.tmdb.org/t/p/w500'

function Row({title, fetchURL, isLargeRow}) {

    //A snippet of code that runs based on a specific condition
    useEffect(() => {

        async function fetchData () {
            const request = await axios.get(fetchURL);
            setMovies(request.data.results)
            return request;
        }

        fetchData();

    }, [fetchURL]);

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1,
        },
    }

    const [movies, setMovies] = useState([]);
    const [trailerURL, setTrailerURL] = useState("");

    const handleClick = (movie) => {
        if (trailerURL) {
            setTrailerURL("");
        } 
        else {
            console.log(movie.name)
            movieTrailer(movie?.name || movie?.title || movie?.original_name || "")
            .then(url => {
                const urlParams = new URLSearchParams(new URL(url).search);
                setTrailerURL(urlParams.get('v'));
            })
            .catch((error) => console.log(error));
        }
    }
    
    return (
        <div className="row">
            <h2>{title}</h2>
            <div className="row-posters">
                {movies.map(movie => (
                    <img key={movie.id}
                        className={`row-poster ${isLargeRow && "row-posterLarge"}`}
                        onClick={() => handleClick(movie)}
                        src={`${baseURL}${isLargeRow ? movie.poster_path: movie.backdrop_path}`} 
                        alt={movie.name}/>
                ))}
            </div>
            {trailerURL && <Youtube videoId={trailerURL} opts={opts} />}
        </div>
    )
}

export default Row;
