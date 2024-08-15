import { FileType } from "../../files/domain/file";
import { Offer } from "./offer";

export class OfferFile {
    id?: string;
    file?: FileType;
    productId?: Offer;
    altTag?: string;
    isDefault?: boolean;
    path?: string;
  }