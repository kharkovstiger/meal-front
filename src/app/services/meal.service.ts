import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Meal} from '../models';
import {Config} from '../../config/config';

@Injectable({providedIn: 'root'})
export class MealService {

  private url = '/meal';

  constructor(private http: HttpClient, private router: Router) {
  }

  getAll() {
    return this.http.get<Meal[]>(Config.baseUrl + this.url + '/all');
  }

  getMeals(calories: number, protein: number, fats: number, carbs: number) {
    const data = {calories, protein, fats, carbs};
    return this.http.post<Meal[]>(Config.baseUrl + this.url, data);
  }
}
