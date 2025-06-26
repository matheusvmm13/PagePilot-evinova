import { Author } from "../../types/author";
import { Book } from "../../types/books";

export const testAuthors: Partial<Author>[] = [
  {
    name: "George R.R. Martin",
    bio: "American novelist and short story writer, best known for his epic fantasy series A Song of Ice and Fire.",
    birthYear: 1948,
  },
  {
    name: "J.R.R. Tolkien",
    bio: "English writer, poet, philologist, and academic, best known for The Hobbit and The Lord of the Rings.",
    birthYear: 1892,
  },
  {
    name: "Margaret Atwood",
    bio: "Canadian poet, novelist, literary critic, essayist, teacher, environmental activist, and inventor.",
    birthYear: 1939,
  },
  {
    name: "Brandon Sanderson",
    bio: "American author of epic fantasy and science fiction, known for the Mistborn series and The Stormlight Archive.",
    birthYear: 1975,
  },
  {
    name: "Ursula K. Le Guin",
    bio: "American author best known for her works of speculative fiction, including science fiction works set in her Hainish universe.",
    birthYear: 1929,
  },
];

export const testBooks: Partial<Book>[] = [
  {
    title: "A Game of Thrones",
    summary:
      "The first novel in A Song of Ice and Fire, an epic fantasy series about noble families fighting for control of the Iron Throne.",
    publicationYear: 1996,
  },
  {
    title: "The Hobbit",
    summary:
      "A fantasy novel about a hobbit's journey with thirteen dwarves to reclaim their homeland from a dragon.",
    publicationYear: 1937,
  },
  {
    title: "The Handmaid's Tale",
    summary:
      "A dystopian novel set in a totalitarian society where women are subjugated and used for reproduction.",
    publicationYear: 1985,
  },
  {
    title: "Mistborn: The Final Empire",
    summary:
      "The first book in the Mistborn trilogy, featuring a world where the chosen one failed and the hero must overthrow a thousand-year empire.",
    publicationYear: 2006,
  },
  {
    title: "A Wizard of Earthsea",
    summary:
      "The first book in the Earthsea series, following the story of Ged, a young wizard learning to master his powers.",
    publicationYear: 1968,
  },
];

export const invalidAuthorData = [
  {
    name: "", // Empty name
    bio: "Valid bio",
    birthYear: 1980,
  },
  {
    name: "Valid name",
    bio: "", // Empty bio
    birthYear: 1980,
  },
  {
    name: "Valid name",
    bio: "Valid bio",
    birthYear: 1700, // Too old
  },
  {
    name: "Valid name",
    bio: "Valid bio",
    birthYear: 2030, // Future year
  },
];

export const invalidBookData = [
  {
    title: "", // Empty title
    summary: "Valid summary",
    publicationYear: 2020,
    authorId: "valid-uuid",
  },
  {
    title: "Valid title",
    summary: "", // Empty summary
    publicationYear: 2020,
    authorId: "valid-uuid",
  },
  {
    title: "Valid title",
    summary: "Valid summary",
    publicationYear: 1400, // Too old
    authorId: "valid-uuid",
  },
  {
    title: "Valid title",
    summary: "Valid summary",
    publicationYear: 2020,
    authorId: "invalid-uuid", // Invalid UUID
  },
];
