import { Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ChatsListComponent} from "../chats-list/chats-list.component";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChatsService } from '@tt/data-access';
import { timer } from 'rxjs';


@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [RouterOutlet, ChatsListComponent],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
})
export class ChatsPageComponent  {

  #chatService = inject(ChatsService);

  constructor() {
    timer(0, 1000000)
    this.#chatService.connectWs()
      .pipe(takeUntilDestroyed())
      .subscribe()

  }


  // ngOnInit() {
  //   this.#chatService.connectWs().subscribe()
  // }
}
