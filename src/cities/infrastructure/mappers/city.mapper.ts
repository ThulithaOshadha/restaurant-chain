import { City } from '../../../cities/domain/city.domain';
import { CitiesEntity } from '../entity/city.entity';

export class CityMapper {
  static toDomain(raw: CitiesEntity): City {
    const city = new City();
    city.id = raw.id;
    city.name = raw.name;
    city.lat = raw.lat;
    city.lang = raw.lang;
    if (raw.mapObject) {
      city.mapObject = raw.mapObject;
    }
    city.status = raw.status;
    city.createdAt = raw.createdAt;
    city.updatedAt = raw.updatedAt;
    city.deletedAt = raw.deleteddAt;
    return city;
  }

  static toPersistence(city: City): CitiesEntity {
    const cityEntity = new CitiesEntity();

    if (city.id && typeof city.id === 'string') {
      cityEntity.id = city.id;
    }
    cityEntity.name = city.name;
    cityEntity.lang = city.lang;
    cityEntity.lat = city.lat;
    cityEntity.status = city.status;
    return cityEntity;
  }
}
