import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {Course, CourseType} from '../../models';
import {CourseService} from '../../services';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {merge, Observable, Subscription} from 'rxjs';
import {catchError, map, startWith, switchMap, timeout} from 'rxjs/operators';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  templateUrl: 'course.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CourseComponent {
  types: (string | CourseType)[] = Object.values(CourseType);
  course: Course;
  courses: MatTableDataSource<Course>;
  isLoadingResults: boolean;
  resultsLength: number;
  columns: string[] = ['name', 'calories', 'protein', 'fats', 'carbs'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private readonly navigationSubscription: Subscription;

  constructor(private courseService: CourseService, private changeDetectorRefs: ChangeDetectorRef, private router: Router) {
    this.course = new Course();
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        setTimeout(() => this.initTable(), 1000);
      }
    });
  }

  add() {
    this.courseService.add(this.course);
    this.course = new Course();
  }

  getAll(): Observable<Course[]> {
    return this.courseService.getAll();
  }

  private initTable() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.isLoadingResults = true;
    this.resultsLength = 0;
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.getAll();
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.resultsLength = data.length;

          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return new Observable<Course[]>();
        })
      ).subscribe(data => {
        console.log(data);
        this.courses = new MatTableDataSource(data);
        this.courses.paginator = this.paginator;
        this.courses.sort = this.sort;
        this.changeDetectorRefs.detectChanges();
      }
    );
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
}
