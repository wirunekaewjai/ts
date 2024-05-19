export declare global {
  export type i8 = number;
  export type i16 = number;
  export type i32 = number;
  export type i64 = number;

  export type u8 = number;
  export type u16 = number;
  export type u32 = number;
  export type u64 = number;

  export declare function json(value: Record<string, string | number | boolean>): string;
}