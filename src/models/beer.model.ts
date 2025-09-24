export interface Beer {
  name: string;
  brewery: string;
  style: string;
  abv: number;
  ibu?: number;
  tastingNotes: string[];
  description: string;
  imageUrl?: string;
}