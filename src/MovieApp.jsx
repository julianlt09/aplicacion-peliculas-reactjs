import { useState, useEffect, useRef } from 'react'
import './MovieApp.css'

export const MovieApp = () => {
  const [search, setsearch] = useState('')
  const [moviesList, setmoviesList] = useState([])
  const canvasRef = useRef(null)

  const urlBase = 'https://api.themoviedb.org/3/search/movie'
  const API_KEY = 'dfed4ffe3d115a47180b8d086bb1cf2b'

  // ── Partículas ──────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const pts = Array.from({ length: 70 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.15,
      pulse: Math.random() * Math.PI * 2,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const t = Date.now() / 1000

      for (const p of pts) {
        p.x += p.dx
        p.y += p.dy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        const a = p.alpha * (0.7 + 0.3 * Math.sin(t * 1.2 + p.pulse))
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(192, 132, 252, ${a})`
        ctx.fill()
      }

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 100) {
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.12 * (1 - d / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])
  // ────────────────────────────────────────────────────────────

  const handleInputChange = ({ target }) => setsearch(target.value)

  const handleSubmit = (event) => {
    event.preventDefault()
    fetchMovies()
  }

  const fetchMovies = async () => {
    try {
      const response = await fetch(
        `${urlBase}?query=${search}&api_key=${API_KEY}&language=es-ES`
      )
      const data = await response.json()
      setmoviesList(data.results)
    } catch (error) {
      console.error('Ha ocurrido el siguiente:', error)
    }
  }

  return (
    <>
      <canvas ref={canvasRef} id="particles" />
      <div className="container">
        <h1 className="title">Buscador de peliculas</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Escribe una pelicula"
            value={search}
            onChange={handleInputChange}
          />
          <button className="search-button">Buscar</button>
        </form>
        {moviesList && (
          <div className="movie-list">
            {moviesList.map((movie) => (
              <div key={movie.id} className="movie-card">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
                <h2>{movie.title}</h2>
                <p>{movie.overview}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}