import { FileEntity } from '../../../files/infrastructure/persistence/relational/entities/file.entity';
import { BranchFile } from 'src/branches/domain/branch-file.domain';
import { BranchFilesEntity } from '../entities/branch-files.entity';
import { BranchesEntity } from '../entities/braches.entity';

export class BranchFileMapper {
  static toDomain(raw: BranchFilesEntity): BranchFile {
    const branch = new BranchFile();
    branch.id = raw.file?.id;
    branch.altTag = raw.altTag;
    branch.isDefault = raw.isDefault;
    branch.path = raw.file?.path; 
    if (raw.branch) {
        branch.branchId = raw.branch;
    }

    return branch;
  }

  static toPersistence(branchDomain: BranchFile): BranchFilesEntity {
    const branchEntity = new BranchFilesEntity();
    if (branchDomain.id && typeof branchDomain.id === 'string') {
        branchEntity.id = branchDomain.id;
    }
    let file = new FileEntity();
    if (branchDomain.file) {
      file = new FileEntity();
      file.id = branchDomain.file.id;
    }
    branchEntity.file = file;

    let branch = new BranchesEntity();
    if (branchDomain.branchId) {
      branch = new BranchesEntity();
      branchDomain.id = branchDomain.branchId.id;
    }
    branchEntity.branch = branch;
    return branchEntity;
  }
}
