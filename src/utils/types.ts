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
  firstName: string | null;
  lastName: string | null;
  ftp: string | null;
  weight: string | null;
  instagram: string | null;
  strava: string | null;
  bio: string | null;
  avatarUrl: string | null;
  updateAt: string | null;
  is_admin?: boolean | null;
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
}
