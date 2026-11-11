import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';

import { Order, OrderStatus } from '../../../core/api/models';
import { OrderApi } from '../../../core/api/order-api';
import { NEXT_ORDER_STATUSES, ORDER_STATUS_LABELS, ORDER_STATUS_TONES } from '../../../shared/formatting/labels';
import { PricePipe } from '../../../shared/formatting/price.pipe';
import { RemoteList } from '../remote-list';

const ACTION_LABELS: Readonly<Record<OrderStatus, string>> = {
  PENDING: 'Remettre en attente',
  CONFIRMED: 'Confirmer',
  SHIPPED: 'Marquer expédiée',
  CANCELLED: 'Annuler',
};

@Component({
  selector: 'app-orders-admin',
  imports: [DatePipe, PricePipe],
  templateUrl: './orders-admin.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersAdmin {
  private readonly orderApi = inject(OrderApi);

  protected readonly orders = new RemoteList<Order>(() => this.orderApi.list(), inject(DestroyRef));
  protected readonly statusLabels = ORDER_STATUS_LABELS;
  protected readonly statusTones = ORDER_STATUS_TONES;
  protected readonly nextStatuses = NEXT_ORDER_STATUSES;
  protected readonly actionLabels = ACTION_LABELS;

  constructor() {
    this.orders.load();
  }

  protected changeStatus(order: Order, status: OrderStatus): void {
    this.orders.update(this.orderApi.updateStatus(order.id, status));
  }

  protected itemCount(order: Order): number {
    return order.lines.reduce((sum, line) => sum + line.quantity, 0);
  }
}
