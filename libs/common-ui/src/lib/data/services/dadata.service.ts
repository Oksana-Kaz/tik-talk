import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DADATA_TOKEN } from './token';
import { map, tap } from 'rxjs';
import { DadataSuggestion } from '../interfaces/dadata.interface';

@Injectable({
  providedIn: 'root'
})

export class DadataService {
  #apiUrl = "http://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
  #http = inject(HttpClient);

  getSuggestion(query: string)  {
    return this.#http.post<{suggestions: DadataSuggestion[] }>(this.#apiUrl,{query},{
      'headers': {
        Authorization: `Token ${DADATA_TOKEN}`
      }
    }).pipe(
      map(res => {
        return Array.from(
          new Set(
            res.suggestions.map(suggestion => {
              return suggestion.data.city
            })
          )
        )
      })
    )
  }
}
