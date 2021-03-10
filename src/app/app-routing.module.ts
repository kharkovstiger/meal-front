import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CourseComponent, MainComponent, MealComponent} from './components';


const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'courses', component: CourseComponent},
  {path: 'meals', component: MealComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
