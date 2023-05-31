export interface IPlace {
  public_id: string;
  name: string;
  created_by: {
    first_name: string;
    last_name: string;
  }
  created_date: string;
  photo_url: string;
  description: string;
  video_url: string;
  qr_url: string;
  coordinates: string;
  embedded_url?: string;
}
