import { BranchesEntity } from '../entities/braches.entity';
import { BranchFacility } from 'src/branches/domain/branch-facility.domain';
import { BranchFacilitiesEntity } from '../entities/branch-facilities.entity';
import { FacilitiesEntity } from 'src/facilities/infrastructure/entities/facility.entity';

export class BranchFacilitiesMapper {
    static toDomain(raw: BranchFacilitiesEntity): BranchFacility {
        const branchFacility = new BranchFacility();
        branchFacility.id = raw.id;
        if (raw.branch) {
            branchFacility.branch = raw.branch;
        }
        if (raw.facility) {
            branchFacility.faciliyty = raw.facility;
        }
        return branchFacility;
    }

    static toPersistence(branchFacility: BranchFacility): BranchFacilitiesEntity {
        const branchEntity = new BranchFacilitiesEntity();
        if (branchFacility.id && typeof branchFacility.id === 'string') {
            branchEntity.id = branchFacility.id;
        }
        let facility = new FacilitiesEntity();
        if (branchFacility.faciliyty) {
            facility = new FacilitiesEntity();
            facility.id = branchFacility.faciliyty.id!;
        }
        branchEntity.facility = facility;

        let branch = new BranchesEntity();
        if (branchFacility.branch) {
            branch = new BranchesEntity();
            branchFacility.id = branchFacility.branch.id;
        }
        branchEntity.branch = branch;
        return branchEntity;
    }
}
