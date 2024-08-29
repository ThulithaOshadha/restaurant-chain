import { CityMapper } from 'src/cities/infrastructure/mappers/city.mapper';
import { Branch } from '../../../branches/domain/branch.domain';
import { BranchesEntity } from '../entities/braches.entity';
import { BranchFileMapper } from './branch-file.mapper';
import { CitiesEntity } from 'src/cities/infrastructure/entity/city.entity';
import { FacilityMapper } from 'src/facilities/infrastructure/mappers/facility.mapper';

export class BranchMapper {
    static toDomain(raw: BranchesEntity): Branch {
        const branch = new Branch();

        branch.id = raw.id;
        branch.name = raw.name;
        branch.status = raw.status;
        if (raw.files && raw.files.length) {
            branch.files = raw.files.map((file) => BranchFileMapper.toDomain(file));
        }
        if (raw.city) {
            branch.city = CityMapper.toDomain(raw.city);
        }
        if(raw.facility) {
            branch.facilities = raw.facility.map((facility) => FacilityMapper.toDomain(facility.facility!))
        }
        branch.description = raw.description;
        branch.createdAt = raw.createdAt;
        branch.updatedAt = raw.updatedAt;
        branch.deletedAt = raw.deletedAt;
        return branch;
    }

    static toPersistence(branch: Branch): BranchesEntity {
        const branchEntity = new BranchesEntity();
        if (branch.id && typeof branch.id === 'string') {
            branchEntity.id = branch.id;
        }
        let city;
        if (branch.city) {
            city = new CitiesEntity();
            city.id = branch.city.id;
        }
        branchEntity.city = city;
        branchEntity.name = branch.name;
        branchEntity.description = branch.description ? branch.description : '';
        branchEntity.status = branch.status!;
        return branchEntity;
    }
}
