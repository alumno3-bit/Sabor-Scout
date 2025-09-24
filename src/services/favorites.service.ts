import { Injectable, signal } from '@angular/core';
import { Beer } from '../models/beer.model';

const FAVORITES_KEY = 'sabor-scout-favorites';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private _favorites = signal<Beer[]>([]);
  public favorites = this._favorites.asReadonly();

  constructor() {
    this._loadFavorites();
  }

  private _loadFavorites(): void {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        this._favorites.set(JSON.parse(storedFavorites));
      }
    } catch (e) {
      console.error("Could not load favorites from local storage", e);
      this._favorites.set([]);
    }
  }

  private _saveFavorites(): void {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(this.favorites()));
    } catch (e) {
      console.error("Could not save favorites to local storage", e);
    }
  }

  isFavorite(beer: Beer): boolean {
    return this.favorites().some(fav => fav.name === beer.name && fav.brewery === beer.brewery);
  }

  addFavorite(beer: Beer): void {
    if (!this.isFavorite(beer)) {
      this._favorites.update(current => [...current, beer]);
      this._saveFavorites();
    }
  }

  removeFavorite(beer: Beer): void {
    this._favorites.update(current => 
      current.filter(fav => fav.name !== beer.name || fav.brewery !== beer.brewery)
    );
    this._saveFavorites();
  }
}
