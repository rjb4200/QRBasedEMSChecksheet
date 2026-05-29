declare module "archiver" {
  import { Readable, Transform } from "node:stream";

  interface ZipArchiveOptions {
    zlib?: { level: number };
  }

  interface EntryData {
    name: string;
    prefix?: string;
    date?: Date | string;
    store?: boolean;
    comment?: string;
    stats?: import("node:fs").Stats;
  }

  class ZipArchive extends Readable {
    constructor(options?: ZipArchiveOptions);
    append(source: string | Buffer | Readable, data?: EntryData): this;
    finalize(): void;
    pipe<T extends NodeJS.WritableStream>(destination: T, options?: { end?: boolean }): T;
    on(event: "error", listener: (err: Error) => void): this;
    on(event: "close" | "end" | "finish", listener: () => void): this;
  }

  export { ZipArchive };
}
