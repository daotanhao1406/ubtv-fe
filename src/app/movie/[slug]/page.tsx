async function getMovie(slug: string) {
  const res = await fetch(`https://phimapi.com/phim/${slug}`)
  return res.json()
}

export default async function MovieDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const movieData = await getMovie(slug)

  return <div>Movie {movieData?.movie?.name}</div>
}
