export type SchoolType = '초' | '중' | '고' | '대';

export type Florist = {
  id: string;
  owner_id: string;
  name: string;
  address: string;
  phone: string | null;
  created_at: string;
};

/** nearby_schools RPC 의 반환 행 */
export type NearbySchool = {
  id: string;
  name: string;
  school_type: SchoolType;
  address: string;
  lat: number;
  lng: number;
  distance_m: number;
  graduation_date: string | null;
  graduation_time: string | null;
  student_count: number | null;
  note: string | null;
};

export type Coords = { lat: number; lng: number };

export type AddressResult = {
  address: string;
  placeName?: string;
} & Coords;

export type SortKey = 'distance' | 'date';
