import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Product } from '../../../core/api/models';
import { CATEGORY_LABELS } from '../../../shared/formatting/labels';
import { PricePipe } from '../../../shared/formatting/price.pipe';

@Component({
  selector: 'app-product-card',
  imports: [PricePipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly added = output<Product>();

  protected readonly categoryLabels = CATEGORY_LABELS;
}
