import { FileType } from "../../files/domain/file";
import { Product } from "./product";

export class ProductFile {
    id?: string;
    file?: FileType;
    productId?: Product;
    altTag?: string;
    isDefault?: boolean;
    path?: string;
  }