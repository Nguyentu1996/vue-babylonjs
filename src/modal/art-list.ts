export interface ArtList {
  imgUrl: string;
  width: number;
  height: number;
  position: [];
}
export enum Rotation {
  FRONT = 0,
  RIGHT = Math.PI / 2,
  BACK = Math.PI,
  LEFT = -Math.PI / 2,
}
