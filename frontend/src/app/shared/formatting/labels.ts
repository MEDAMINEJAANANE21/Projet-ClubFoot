import {
  ContactSubject,
  Gender,
  IdentityDocument,
  MembershipStatus,
  OrderStatus,
  ProductCategory,
} from '../../core/api/models';

export type StatusTone = 'pending' | 'success' | 'danger' | 'neutral';

export const CATEGORY_LABELS: Readonly<Record<ProductCategory, string>> = {
  JERSEY: 'Maillot',
  POLO: 'Polo',
  HOODIE: 'Sweat',
};

export const ORDER_STATUS_LABELS: Readonly<Record<OrderStatus, string>> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmée',
  SHIPPED: 'Expédiée',
  CANCELLED: 'Annulée',
};

export const ORDER_STATUS_TONES: Readonly<Record<OrderStatus, StatusTone>> = {
  PENDING: 'pending',
  CONFIRMED: 'neutral',
  SHIPPED: 'success',
  CANCELLED: 'danger',
};

// Mêmes transitions que l'API (OrderStatus.canTransitionTo) : l'interface ne propose que les actions possibles.
export const NEXT_ORDER_STATUSES: Readonly<Record<OrderStatus, readonly OrderStatus[]>> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: [],
  CANCELLED: [],
};

export const MEMBERSHIP_STATUS_LABELS: Readonly<Record<MembershipStatus, string>> = {
  PENDING: 'En attente',
  APPROVED: 'Acceptée',
  REJECTED: 'Refusée',
};

export const MEMBERSHIP_STATUS_TONES: Readonly<Record<MembershipStatus, StatusTone>> = {
  PENDING: 'pending',
  APPROVED: 'success',
  REJECTED: 'danger',
};

export const DOCUMENT_LABELS: Readonly<Record<IdentityDocument, string>> = {
  BIRTH_CERTIFICATE: 'Acte de naissance',
  ID_PHOTO: "Photo d'identité",
  NATIONAL_ID_CARD: 'CIN',
};

export const GENDER_LABELS: Readonly<Record<Gender, string>> = {
  MALE: 'Homme',
  FEMALE: 'Femme',
};

export const SUBJECT_LABELS: Readonly<Record<ContactSubject, string>> = {
  TECHNICAL_ISSUE: 'Problème technique sur le site',
  SHOP: 'Question sur la boutique',
  MEMBERSHIP: 'Adhésion',
  OTHER: 'Autre',
};
