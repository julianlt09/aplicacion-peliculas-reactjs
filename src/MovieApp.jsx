import { useState } from 'react'
import './MovieApp.css'



export const MovieApp = () => {

    const [search, setsearch] = useState('')
    const [moviesList, setmoviesList] = useState([])

    const urlBase = 'https://api.themoviedb.org/3/search/movie'
    const API_KEY = 'dfed4ffe3d115a47180b8d086bb1cf2b'

    const handleInputChange = ({ target }) => {
        setsearch(target.value)
    }
    const handleSubmit = (event) => {
        event.preventDefault()
        fetchMovies()
    }

    const fetchMovies = async () => {
        try {
            const response = await fetch(`${urlBase}?query=${search}&api_key=${API_KEY}&language=es-ES`)
            const data = await response.json()
            setmoviesList(data.results)
            console.log(data.results)
        } catch (error) {
            console.error('Ha ocurrido el siguiente:', error)
        }
    }



    return (
        <div className='container'>
            <h1 className='title'>Buscador de peliculas</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder='Escribe una pelicula'
                    value={search}
                    onChange={handleInputChange}
                />
                <button className='search-button'>Buscar</button>
            </form>
            {moviesList &&
                <div className='movie-list'>
                    {moviesList.map(movie => (
                        <div key={movie.id} className='movie-card'>
                            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                            <h2>{movie.title}</h2>
                            <p>{movie.overview}</p>
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}
