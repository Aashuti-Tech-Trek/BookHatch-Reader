export type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  longDescription: string;
  coverImage: string;
  genre: string;
};

export const genres = [
  "Science Fiction",
  "Fantasy",
  "Mystery",
  "Thriller",
  "Romance",
  "Historical Fiction",
  "Horror",
  "Classic Literature",
  "Adventure",
];

export const books: Book[] = [
  {
    id: "1",
    title: "Dune",
    author: "Frank Herbert",
    description: "A landmark of science fiction, set in the distant future amidst a feudal interstellar society.",
    longDescription: "Dune tells the story of young Paul Atreides, whose family accepts the stewardship of the desert planet Arrakis. As the only source of the valuable substance 'spice', control of Arrakis is a coveted and dangerous undertaking. After a bitter betrayal, Paul must lead a rebellion to restore his family's rightful place.",
    coverImage: "https://placehold.co/300x450.png",
    genre: "Science Fiction",
  },
  {
    id: "2",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description: "A fantasy novel about the quest of home-loving Bilbo Baggins to win a share of the treasure.",
    longDescription: "Whisked away from his comfortable, unambitious life in his hobbit-hole in Bag End by the wizard Gandalf and a company of dwarves, Bilbo Baggins finds himself caught up in a plot to raid the treasure hoard of Smaug the Magnificent, a large and very dangerous dragon.",
    coverImage: "https://placehold.co/300x450.png",
    genre: "Fantasy",
  },
  {
    id: "3",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "A classic romance novel that charts the emotional development of the protagonist, Elizabeth Bennet.",
    longDescription: "This classic novel follows the turbulent relationship between Elizabeth Bennet, the daughter of a country gentleman, and Fitzwilliam Darcy, a rich and aristocratic landowner. They must overcome the titular sins of pride and prejudice in order to fall in love and marry.",
    coverImage: "https://placehold.co/300x450.png",
    genre: "Romance",
  },
  {
    id: "4",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "A novel about the seriousness of racism and the loss of innocence in the American South.",
    longDescription: "The story, told by the six-year-old Jean Louise Finch, takes place during three years of the Great Depression in the fictional 'tired old town' of Maycomb, Alabama. She and her brother Jem are raised by their widowed father, Atticus Finch, a principled lawyer who defends a black man unjustly accused of a terrible crime.",
    coverImage: "https://placehold.co/300x450.png",
    genre: "Historical Fiction",
  },
  {
    id: "5",
    title: "1984",
    author: "George Orwell",
    description: "A dystopian novel set in a world of perpetual war, omnipresent government surveillance, and propaganda.",
    longDescription: "The story follows the life of Winston Smith, a low-ranking member of 'the Party', who is frustrated by the omnipresent eyes of the party, and its ominous ruler Big Brother. Winston works in the Ministry of Truth and is driven to rebellion against the totalitarian state.",
    coverImage: "https://placehold.co/300x450.png",
    genre: "Science Fiction",
  },
  {
    id: "6",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A novel about the American dream, set in the Jazz Age on Long Island.",
    longDescription: "The story primarily concerns the young and mysterious millionaire Jay Gatsby and his quixotic passion and obsession with the beautiful former debutante Daisy Buchanan. The Great Gatsby explores themes of decadence, idealism, resistance to change, social upheaval, and excess.",
    coverImage: "https://placehold.co/300x450.png",
    genre: "Classic Literature",
  },
  {
    id: "7",
    title: "Moby Dick",
    author: "Herman Melville",
    description: "The saga of Captain Ahab and his relentless pursuit of Moby Dick, the great white whale.",
    longDescription: "The book is the sailor Ishmael's narrative of the obsessive quest of Ahab, captain of the whaling ship Pequod, for revenge on Moby Dick, the giant white sperm whale that on the ship's previous voyage bit off Ahab's leg at the knee.",
    coverImage: "https://placehold.co/300x450.png",
    genre: "Adventure",
  },
  {
    id: "8",
    title: "The Shining",
    author: "Stephen King",
    description: "A horror novel about an aspiring writer and recovering alcoholic who accepts a position as the off-season caretaker.",
    longDescription: "Jack Torrance, his wife Wendy, and their young son Danny move into the isolated Overlook Hotel in the Colorado Rockies. As the winter weather cuts them off from the outside world, the hotel's supernatural forces start to influence Jack's sanity, putting his family in terrible danger.",
    coverImage: "https://placehold.co/300x450.png",
    genre: "Horror",
  },
    {
    id: "9",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    description: "A shocking psychological thriller of a woman’s act of violence against her husband.",
    longDescription: "Alicia Berenson’s life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house with big windows overlooking a park in one of London’s most desirable areas. One evening her husband Gabriel returns home late from a fashion shoot, and Alicia shoots him five times in the face, and then never speaks another word.",
    coverImage: "https://placehold.co/300x450.png",
    genre: "Thriller",
  },
  {
    id: "10",
    title: "And Then There Were None",
    author: "Agatha Christie",
    description: "Ten strangers are lured to an isolated island mansion off the Devon coast by a mysterious host.",
    longDescription: "Ten strangers, each with a secret to hide, are invited to an isolated island. As they settle in, a storm cuts them off from the mainland. One by one, they are picked off, in accordance with the lines of a sinister nursery rhyme. The suspense builds as they realize the killer is one of them.",
    coverImage: "https://placehold.co/300x450.png",
    genre: "Mystery",
  },
];
