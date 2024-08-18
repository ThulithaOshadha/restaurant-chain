import { FileType } from "../../files/domain/file";
import { Branch } from "./branch.domain";

export class BranchFile {
    id?: string;
    file?: FileType;
    branchId?: Branch;
    altTag?: string;
    isDefault?: boolean;
    path?: string;
  }