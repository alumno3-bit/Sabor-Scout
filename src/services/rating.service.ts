import { Injectable, signal } from '@angular/core';
import { Beer } from '../models/beer.model';

const RATING_KEY = 'sabor-scout-ratings';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private _ratings = signal<{[key: string]: number}>({});
  public ratings = this._ratings.asReadonly();

  constructor() {
    this._loadRatings();
  }

  private _getBeerKey(beer: Beer): string {
    return `${beer.name}|${beer.brewery}`;
  }

  private _loadRatings(): void {
    try {
      const storedRatings = localStorage.getItem(RATING_KEY);
      if (storedRatings) {
        this._ratings.set(JSON.parse(storedRatings));
      }
    } catch (e) {
      console.error("Could not load ratings from local storage", e);
      this._ratings.set({});
    }
  }

  private _saveRatings(): void {
    try {
      localStorage.setItem(RATING_KEY, JSON.stringify(this.ratings()));
    } catch (e) {
      console.error("Could not save ratings to local storage", e);
    }
  }

  getRating(beer: Beer): number {
    const key = this._getBeerKey(beer);
    return this.ratings()[key] || 0;
  }

  setRating(beer: Beer, rating: number): void {
    const key = this._getBeerKey(beer);
    this._ratings.update(current => {
      const newRatings = {...current};
      newRatings[key] = rating;
      return newRatings;
    });
    this._saveRatings();
  }
}
