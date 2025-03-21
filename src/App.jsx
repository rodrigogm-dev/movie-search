import React, { useState, useEffect } from 'react'

const API_KEY = '0f842b617a146c822d68353fddf1c688'
const GENRE_API_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`

function App () {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [genres, setGenres] = useState({}) // Guardamos los géneros aquí

  // Cargar los géneros cuando se monta el componente
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(GENRE_API_URL)
        const data = await response.json()

        // Convertimos el array de géneros en un objeto { id: nombre }
        const genreMap = {}
        data.genres.forEach(genre => {
          genreMap[genre.id] = genre.name
        })

        setGenres(genreMap)
      } catch (error) {
        console.error('Error al obtener los géneros:', error)
      }
    }

    fetchGenres()
  }, [])

  const searchMovies = async () => {
    if (!query) return

    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`

    try {
      const response = await fetch(url)
      const data = await response.json()

      // Filtrar solo películas con imagen
      const filteredMovies = data.results.filter(movie => movie.poster_path)

      setMovies(filteredMovies)
    } catch (error) {
      console.error('Error al buscar películas:', error)
    }
  }

  return (
    <div className='app-box'>
      <div className='search-box'>
        <input
          className='input-search'
          type='text'
          placeholder='Buscar una película...'
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button onClick={searchMovies}>Buscar!</button>
      </div>

      <div className='results-box'>
        {movies.length > 0 ? (
          movies.map(movie => (
            <div className='movie-box' key={movie.id}>
              <h3>{movie.title}</h3>
              <p>{movie.release_date}</p>
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
              <p>
                <strong>Géneros:</strong>{' '}
                {movie.genre_ids.map(id => genres[id]).join(', ')}
              </p>
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  )
}

export default App
