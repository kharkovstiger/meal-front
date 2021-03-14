import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Router} from '@angular/router';
import {Meal} from '../../models';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {merge, Observable, Subscription} from 'rxjs';
import {MealService} from '../../services/meal.service';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';

@Component({
  templateUrl: 'meal.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MealComponent {
  meals: MatTableDataSource<Meal>;
  isLoadingResults: boolean;
  resultsLength: number;
  columns: string[] = ['calories', 'protein', 'fats', 'carbs', 'breakfast', 'snack', 'dinner', 'snack2', 'supper', 'additions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private readonly navigationSubscription: Subscription;

  constructor(private mealService: MealService, private changeDetectorRefs: ChangeDetectorRef, private router: Router) {
  }

  getMeals(calories: number, protein: number, fats: number, carbs: number): Observable<Meal[]> {
    return this.mealService.getMeals(calories, protein, fats, carbs);
  }

  private initTable(calories: number, protein: number, fats: number, carbs: number) {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.isLoadingResults = true;
    this.resultsLength = 0;
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.getMeals(calories, protein, fats, carbs);
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.resultsLength = data.length;

          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return new Observable<Meal[]>();
        })
      ).subscribe(data => {
        console.log(data);
        this.meals = new MatTableDataSource(data);
        this.meals.paginator = this.paginator;
        this.meals.sort = this.sort;
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

  show(calories: number, protein: number, fats: number, carbs: number) {
    this.initTable(calories, protein, fats, carbs);
  }

  getFieldValue(element: any) {
    if (Array.isArray(element)) {
      return Array.from(element, e => e.name);
    } else if (typeof element === 'object') {
      return element.name;
    } else {
      return element;
    }
  }
}
