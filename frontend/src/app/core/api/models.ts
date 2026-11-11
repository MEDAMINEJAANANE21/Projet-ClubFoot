export type ProductCategory = 'JERSEY' | 'POLO' | 'HOODIE';

export interface Product {
  readonly id: number;
  readonly name: string;
  readonly category: ProductCategory;
  readonly color: string;
  readonly price: number;
  readonly imageUrl: string;
  readonly badge: string | null;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'CANCELLED';

export interface OrderLineRequest {
  readonly productId: number;
  readonly quantity: number;
}

export interface CreateOrderRequest {
  readonly fullName: string;
  readonly email: string;
  readonly phone: string;
  readonly address: string;
  readonly city: string;
  readonly lines: readonly OrderLineRequest[];
}

export interface OrderLine {
  readonly productId: number;
  readonly productName: string;
  readonly unitPrice: number;
  readonly quantity: number;
  readonly subtotal: number;
}

export interface Order {
  readonly id: number;
  readonly reference: string;
  readonly customerName: string;
  readonly email: string;
  readonly phone: string;
  readonly address: string;
  readonly city: string;
  readonly status: OrderStatus;
  readonly total: number;
  readonly createdAt: string;
  readonly lines: readonly OrderLine[];
}

export type Gender = 'MALE' | 'FEMALE';
export type IdentityDocument = 'BIRTH_CERTIFICATE' | 'ID_PHOTO' | 'NATIONAL_ID_CARD';
export type MembershipStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface MembershipRequest {
  readonly fullName: string;
  readonly birthDate: string;
  readonly gender: Gender;
  readonly email: string;
  readonly phone: string;
  readonly address: string;
  readonly country: string;
  readonly documents: readonly IdentityDocument[];
  readonly consent: boolean;
}

export interface Membership extends Omit<MembershipRequest, 'consent'> {
  readonly id: number;
  readonly status: MembershipStatus;
  readonly createdAt: string;
}

export type ContactSubject = 'TECHNICAL_ISSUE' | 'SHOP' | 'MEMBERSHIP' | 'OTHER';

export interface ContactMessageRequest {
  readonly name: string;
  readonly email: string;
  readonly subject: ContactSubject;
  readonly message: string;
}

export interface ContactMessage extends ContactMessageRequest {
  readonly id: number;
  readonly read: boolean;
  readonly createdAt: string;
}

export interface LoginRequest {
  readonly username: string;
  readonly password: string;
}

export interface TokenResponse {
  readonly token: string;
  readonly username: string;
  readonly expiresAt: string;
}
