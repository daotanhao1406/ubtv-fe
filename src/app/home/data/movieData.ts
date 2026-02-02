export interface Movie {
  id: string
  title: string
  year: number
  genre: string
  imageUrl: string
  videoUrl: string
  rating: number
  description: string
}

export const recommendedMovies = [
  {
    id: 'demon-slayer',
    title: 'Demon Slayer',
    year: 2019,
    genre: 'Shounen',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg',
    videoUrl: 'https://raw.githubusercontent.com/daotanhao1406/anime-video/master/demon-slayer.mp4',
    rating: 8.43,
    description:
      "Ever since the death of his father, the burden of supporting the family has fallen upon Tanjirou Kamado's shoulders. Though living impoverished on a remote mountain, the Kamado family are able to enjoy a relatively peaceful and happy life.",
  },
  {
    id: 'chainsaw-man',
    title: 'Chainsaw Man',
    year: 2022,
    genre: 'Fantasy',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1806/126216.jpg',
    videoUrl: 'https://raw.githubusercontent.com/daotanhao1406/anime-video/master/chainsaw-man.mp4',
    rating: 8.45,
    description:
      "Denji is robbed of a normal teenage life, left with nothing but his deadbeat father's overwhelming debt. His only companion is his pet, the chainsaw devil Pochita, with whom he slays devils for money that inevitably ends up in the yakuza's pockets.",
  },
  {
    id: 'jujutsu-kaisen',
    title: 'Jujutsu Kaisen',
    year: 2020,
    genre: 'Supernatural',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg',
    videoUrl: 'https://raw.githubusercontent.com/daotanhao1406/anime-video/master/jujutsu-kaisen.mp4',
    rating: 8.55,
    description: 'Idly indulging in baseless paranormal activities with the Occult Club, high schooler Yuuji Itadori spends his days at either the clubroom or the hospital, where he visits his bedridden grandfather.',
  },
  {
    id: 'attack-on-titan',
    title: 'Attack On Titan',
    year: 2013,
    genre: 'Military',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',
    videoUrl: 'https://raw.githubusercontent.com/daotanhao1406/anime-video/master/attack-on-titan.mp4',
    rating: 8.5,
    description: 'Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans, forcing humans to hide in fear behind enormous concentric walls.',
  },
  {
    id: 'horimiya',
    title: 'Horimiya',
    year: 2021,
    genre: 'School',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1695/111486.jpg',
    videoUrl: 'https://raw.githubusercontent.com/daotanhao1406/anime-video/master/horimiya.mp4',
    rating: 8.19,
    description:
      "On the surface, the thought of Kyouko Hori and Izumi Miyamura getting along would be the last thing in people's minds. After all, Hori has a perfect combination of beauty and brains, while Miyamura appears meek and distant to his fellow classmates.",
  },
  {
    id: 'call-of-the-night',
    title: 'Call Of The Night',
    year: 2022,
    genre: 'Vampire',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1045/123711.jpg',
    videoUrl: 'https://raw.githubusercontent.com/daotanhao1406/anime-video/master/call-of-the-night.mp4',
    rating: 7.95,
    description: 'Kou Yamori is an average middle school student who struggles with grasping the complex concept of love. Because he sees little sense in surrendering to the norm, he soon stops going to school.',
  },
  {
    id: 'blue-lock',
    title: 'Blue Lock',
    year: 2022,
    genre: 'Team Sports',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1258/126929.jpg',
    videoUrl: 'https://raw.githubusercontent.com/daotanhao1406/anime-video/master/blue-lock.mp4',
    rating: 8.19,
    description: 'Yoichi Isagi was mere moments away from scoring a goal that would have sent his high school soccer team to the nationals, but a split-second decision to pass the ball to his teammate cost him that reality.',
  },
  {
    id: 'darling-in-the-franxx',
    title: 'Darling In The Franxx',
    year: 2018,
    genre: 'Sci-Fi',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1614/90408.jpg',
    videoUrl: 'https://raw.githubusercontent.com/daotanhao1406/anime-video/master/darling-in-the-franxx.mp4',
    rating: 7.19,
    description: 'In the distant future, humanity has been driven to near-extinction by giant beasts known as Klaxosaurs, forcing the surviving humans to take refuge in massive fortress cities called Plantations.',
  },
  {
    id: 'charlotte',
    title: 'Charlotte',
    year: 2015,
    genre: 'Super Power',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1826/147276.jpg',
    videoUrl: 'https://raw.githubusercontent.com/daotanhao1406/anime-video/master/charlotte.mp4',
    rating: 7.75,
    description:
      "If not for his ability to take over people's mind and body, Yuu Otosaka would be an ordinary high school student. Though it only lasts for five seconds at a time, Yuu's mysterious power allowed him to cheat his way to the top of his class and  enter a prestigious high school.",
  },
  {
    id: 'tokyo-ghoul',
    title: 'Tokyo Ghoul',
    year: 2014,
    genre: 'Action',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1498/134443.jpg',
    videoUrl: 'https://raw.githubusercontent.com/daotanhao1406/anime-video/master/tokyo-ghoul.mp4',
    rating: 7.79,
    description: 'A sinister threat is invading Tokyo: flesh-eating "ghouls" who appear identical to humans and blend into their population. Reserved college student Ken Kaneki buries his nose in books and avoids the news of the growing crisis',
  },
]
