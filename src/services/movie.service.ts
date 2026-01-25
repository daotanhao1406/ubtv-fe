export async function getMovie(slug: string) {
  const res = await fetch(`https://phimapi.com/phim/${slug}`)
  return res.json()
}
