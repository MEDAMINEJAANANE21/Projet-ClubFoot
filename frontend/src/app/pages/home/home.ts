import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Trophy {
  readonly count: number;
  readonly label: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly trophies: readonly Trophy[] = [
    { count: 22, label: 'Championnats du Maroc' },
    { count: 9, label: 'Coupes du Trône' },
    { count: 3, label: 'Ligues des champions de la CAF' },
    { count: 1, label: "Coupe d'Afrique des vainqueurs de coupe" },
    { count: 1, label: 'Supercoupe de la CAF' },
  ];
}
