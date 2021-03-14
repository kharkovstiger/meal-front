export class Course {
  id: string;
  name: string;
  calories: number;
  fats: number;
  protein: number;
  carbs: number;
  type: CourseType;
  recipe: string;
}

export enum CourseType {
  BREAKFAST = 'BREAKFAST',
  SNACK = 'SNACK',
  DINNER = 'DINNER',
  SNACK_2 = 'SNACK_2',
  SUPPER = 'SUPPER',
  ADDITION = 'ADDITION'
}
