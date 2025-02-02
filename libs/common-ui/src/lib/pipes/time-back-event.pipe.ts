import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'timeBackEvent',
  standalone: true,
})
export class TimeBackEventPipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value) return 'unknown';

    const dateTime = DateTime.fromISO(value, { zone: 'utc' });
    return dateTime.toRelative() || ''; // Fallback to empty string if `toRelative` fails
  }
}
