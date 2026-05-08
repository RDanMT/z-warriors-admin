export interface Character {
  id: number;
  name: string;
  ki: string;
  maxKi: string;
  race: string;
  gender: string;
  description: string;
  image: string;
  affiliation: string;
  deletedAt: string | null;
}

export interface CharacterMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface CharactersResponse {
  items: Character[];
  meta: CharacterMeta;
  links: {
    first: string;
    previous: string;
    next: string;
    last: string;
  };
}

export type RaceType = 'Saiyan' | 'Human' | 'Namekian' | 'Frieza Race' | string;
