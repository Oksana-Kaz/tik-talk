import { Component } from '@angular/core';
import { FormsExperimentComponent } from '../forms-experiment/forms-experiment.component';
import { Observable } from 'rxjs';

function customTimer(interval: number) {
  return new Observable(subscriner => {
    let i = 0;

    const intId = setInterval(() => {
      subscriner.next(i++)
      console.log('INSIDE INTERVAL', i)
    }, interval)

    return () => {
      console.log('DESTROYNG')
      clearInterval(intId)
    }
  })
}
// instance of closure
function random() {
  const random = Math.random()
  return new Observable(subscriner => {
    subscriner.next(random)
  })
}
@Component({
  selector: 'app-experimental-page',
  standalone: true,
  imports: [FormsExperimentComponent],
  templateUrl: './experimental-page.component.html',
  styleUrl: './experimental-page.component.scss',
})

export class ExperimentalPageComponent {}

const sub = customTimer(2000)
  .subscribe(val => console.log(val))
setTimeout(() => {
  sub.unsubscribe()
}, 4000)
