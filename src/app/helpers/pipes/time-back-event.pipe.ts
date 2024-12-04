import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';



@Pipe({
  name: 'timeBackEvent',
  standalone: true
})
export class TimeBackEventPipe implements PipeTransform {

  transform(value: any): any {
    if (!value) return 'unknown';

    // const someDate = DateTime.fromISO(value);
    // if (!someDate.isValid) return 'invalid date';

    const currentDate = DateTime.now();

    return currentDate.minus({hours:2}).toFormat("MMM dd, yyyy, HH:mm:ss")
    // const diff = currentDate.diff(someDate, ['years', 'months', 'days', 'hours', 'minutes', 'seconds']);
    // const diff = currentDate.diff(hoursAgo, ['years', 'months', 'days', 'hours', 'minutes', 'seconds']);
    //
    // if (diff.toMillis() < 0) {
    //   return 'Data in the future';
    // }
    //
    // if (diff.years >= 1) return `${Math.floor(diff.years)} years ago`;
    // if (diff.months >= 1) return `${Math.floor(diff.months)} months ago`;
    // if (diff.days >= 1) return `${Math.floor(diff.days)} days ago`;
    // if (diff.hours >= 1) return `${Math.floor(diff.hours)} hours ago`;
    // if (diff.minutes >= 1) return `${Math.floor(diff.minutes)} minutes ago`;
    // return 'Just now';
  }
}
