import { FileType } from "../../files/domain/file";
import { Facility } from "./facility";

export class FacilityFile {
    id?: string;
    file?: FileType;
    facilityId?: Facility;
    altTag?: string;
    isDefault?: boolean;
    path?: string;
  }