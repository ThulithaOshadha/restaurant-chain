import { Facility } from 'src/facilities/domain/facility';
import { FacilitiesEntity } from '../entities/facility.entity';
import { FacilityFileMapper } from './facility-files.mapper';

export class FacilityMapper {
    static toDomain(raw: FacilitiesEntity): Facility {
        const facility = new Facility();

        facility.id = raw.id;
        facility.name = raw.name;
        facility.status = raw.status;
        if (raw.files && raw.files.length) {
            facility.files = raw.files.map((file) => FacilityFileMapper.toDomain(file));
        }
        facility.price = raw.price;
        facility.description = raw.description;
        facility.createdAt = raw.createdAt;
        facility.updatedAt = raw.updatedAt;
        facility.deletedAt = raw.deletedAt;
        return facility;
    }

    static toPersistence(facility: Facility): FacilitiesEntity {
        const facilityEntity = new FacilitiesEntity();
        if (facility.id && typeof facility.id === 'string') {
            facilityEntity.id = facility.id;
        }
        facilityEntity.price = facility.price;
        facilityEntity.name = facility.name;
        facilityEntity.description = facility.description ? facility.description : '';
        facilityEntity.status = facility.status!;
        return facilityEntity;
    }
}
