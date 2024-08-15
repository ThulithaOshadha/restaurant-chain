import { FileType } from "src/files/domain/file";

export class GalleryFile {
    id?: string;
    file?: FileType;
    isDefault?: boolean;
    path?: string;
    imageSizes?: any;
  }