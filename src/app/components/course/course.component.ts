import {Component} from '@angular/core';
import {Course, CourseType} from '../../models';
import {CourseService} from '../../services';

@Component({
  templateUrl: 'course.component.html'
})
export class CourseComponent {
  types: (string | CourseType)[] = Object.values(CourseType);
  course: Course;

  constructor(private courseService: CourseService) {
    console.log(this.types);
    this.course = new Course();
  }

  add() {
    console.log(this.course);
    this.courseService.add(this.course);
    this.course = new Course();
  }
}
