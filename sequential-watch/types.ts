export interface WatchItem {
  dirs: string[];
  callback: () => Promise<void> | void;
}