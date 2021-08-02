export interface Track {
  getTitle(): Promise<string>;
  getArtist(): Promise<string>;
  getDuration(): Promise<string>;
}
