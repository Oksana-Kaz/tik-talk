import { Component, OnInit, output } from '@angular/core';

@Component({
  selector: 'tt-infinite-scroll-trigger',
  standalone: true,
  imports: [],
  templateUrl: './infinite-scroll-trigger.component.html',
  styleUrl: './infinite-scroll-trigger.component.css'
})
export class InfiniteScrollTriggerComponent implements OnInit {

  loaded = output<void>()

  ngOnInit() {
    this.loaded.emit()
  }
}
