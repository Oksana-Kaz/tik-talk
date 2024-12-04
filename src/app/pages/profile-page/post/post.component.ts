import { Component } from '@angular/core';
import {take} from "rxjs";
import {TimeBackEventPipe} from "../../../helpers/pipes/time-back-event.pipe";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    TimeBackEventPipe,
    DatePipe
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  currentTime = Date.now();
  messageDate = "2024-12-10T18:34:56"


  constructor() {
    console.log(this.currentTime)
    console.log(this.messageDate)

  }
}
