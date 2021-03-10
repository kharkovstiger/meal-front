import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Config} from '../../config/config';
import {Course} from '../models';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class CourseService {

  private url = '/course';

  constructor(private http: HttpClient, private router: Router) {
  }

  add(course: Course) {
    this.http.put(Config.baseUrl + this.url + '/add', course).subscribe(r => {
    });
  }

  getAll() {
    return this.http.get<Course[]>(Config.baseUrl + this.url + '/all');
  }
}
