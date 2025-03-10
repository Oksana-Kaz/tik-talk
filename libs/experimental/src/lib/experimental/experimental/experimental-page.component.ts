import { Component } from '@angular/core';
import { FormsExperimentComponent } from '../forms-experiment/forms-experiment.component';


@Component({
  selector: 'app-experimental-page',
  standalone: true,
  imports: [FormsExperimentComponent],
  templateUrl: './experimental-page.component.html',
  styleUrl: './experimental-page.component.scss',
})
export class ExperimentalPageComponent {}
