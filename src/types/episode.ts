export interface EpisodeItem {
  filename: string
  link_embed: string
  link_m3u8: string
  name: string
  slug: string
}

export interface EpisodeReponse {
  server_data: EpisodeItem[]
  server_name: string
}
