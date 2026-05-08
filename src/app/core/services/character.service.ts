import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Character, CharactersResponse } from '../models/character.model';

const API_BASE = 'https://dragonball-api.com/api';

@Injectable({ providedIn: 'root' })
export class CharacterService {
  private http = inject(HttpClient);

  getCharacters(page: number, limit: number): Observable<CharactersResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<CharactersResponse>(`${API_BASE}/characters`, { params });
  }

  getCharacterById(id: number): Observable<Character> {
    return this.http.get<Character>(`${API_BASE}/characters/${id}`);
  }
}
