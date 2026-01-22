import {
  Factor,
  FactorType,
  UserAppMetadata,
  UserIdentity,
  UserMetadata,
} from "@supabase/supabase-js";

export interface User {
  id: string;
  isAdmin: boolean;
  app_metadata: UserAppMetadata;
  user_metadata: UserMetadata;
  aud: string;
  confirmation_sent_at?: string;
  recovery_sent_at?: string;
  email_change_sent_at?: string;
  new_email?: string;
  new_phone?: string;
  invited_at?: string;
  action_link?: string;
  email?: string;
  phone?: string;
  created_at: string;
  confirmed_at?: string;
  email_confirmed_at?: string;
  phone_confirmed_at?: string;
  last_sign_in_at?: string;
  role?: string;
  updated_at?: string;
  identities?: UserIdentity[];
  is_anonymous?: boolean;
  is_sso_user?: boolean;
  factors?: (
    | Factor<FactorType, "verified">
    | Factor<FactorType, "unverified">
  )[];
  deleted_at?: string;
}

export type RaceType = "road" | "crit" | "tt" | "triathlon" | "social";

export interface Rider {
  uuid: string;
  email: string;
  isEmailConfirmed: boolean;
  isPaid: boolean;
  isActivated: boolean;
  firstName: string | null;
  lastName: string | null;
  instagram: string | null;
  strava: string | null;
  bio: string | null;
  avatarUrl: string | null;
  updateAt: string | null;
  is_admin?: boolean | null;
  contractStartDate?: string | null;
  lastPaymentDate?: string | null;
  nextPaymentDueDate?: string | null;
  paymentAmount?: number | null;
}

export interface PaymentOverview {
  uuid: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  contractStartDate: string | null;
  lastPaymentDate: string | null;
  nextPaymentDueDate: string | null;
  isPaid: boolean;
  paymentAmount: number | null;
  payment_status: "No payment info" | "Overdue" | "Due Soon" | "Current";
  days_overdue: number;
}

export interface RaceCalendar {
  id: string;
  name: string;
  event_date: string;
  url?: string | null;
  profile?: string | null;
  distance_km?: number | null;
  elevation_m?: number | null;
  race_type: RaceType;
  location?: string | null;
  created_at: string;
  participants?: string[] | null;
  series?: string | null;
  series_image?: string | null;
}

export interface News {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  main_image_url?: string | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  is_published: boolean;
}

export interface GobikProduct {
  id: number;
  category: string;
  product_name: string;
  variant: string | null;
  price_5_24_eur: number;
  currency: string;
}

export type Size =
  | "2XS"
  | "XS"
  | "S"
  | "M"
  | "L"
  | "XL"
  | "2XL"
  | "3XL"
  | "4XL";
export type Gender = "Men" | "Women";

export interface CartItem {
  productId: number;
  productName: string;
  category: string;
  variant: string | null;
  price: number;
  currency: string;
  quantity: number;
  size: Size;
  gender: Gender;
}

export interface Cart {
  items: CartItem[];
  updatedAt: string;
}

export interface FourEnduranceStoreProduct {
  name: string;
  price: number;
  currency: string | null;
  product_item_info: string | null;
  available_bool: boolean | null;
  img_reference: string | null;
  product_url: string | null;
  product_id: string | number | null;
  variant_id: string | number | null;
  sku: string | null;
}

export interface StoreManagement {
  id: number;
  store_name: string;
  store_table_name: string;
  is_open: boolean;
  display_name: string;
  description: string | null;
  closing_date: string | null;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: number;
  order_id: number;
  variant_id: number | null;
  product_name: string;
  quantity: number;
  price_at_time: number;
  currency: string;
  created_at: string;
}

export interface Order {
  id: number;
  user_id: string;
  total_price: number;
  currency: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  // Joined data (optional, for admin views)
  user_email?: string | null;
  user_first_name?: string | null;
  user_last_name?: string | null;
  items?: OrderItem[];
}
