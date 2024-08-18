import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CityEntity } from '../../../cities/infrastructure/entity/city.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CitySeedService {
  constructor(
    @InjectRepository(CityEntity)
    private repository: Repository<CityEntity>,
  ) {}

  async run() {
    const cities = [
      { name: 'Nawala', lat: 6.9000, lang: 79.8833 },
      { name: 'Rajagiriya', lat: 6.9167, lang: 79.9000 },
      { name: 'Nugegoda', lat: 6.8728, lang: 79.8889 },
      { name: 'Narahenpita', lat: 6.8950, lang: 79.8761 },
      { name: 'Battaramulla', lat: 6.9103, lang: 79.9410 },
    ];

    for (const city of cities) {
      const cityCount = await this.repository.count({
        where: { name: city.name },
      });

      if (!cityCount) {
        await this.repository.save(this.repository.create(city));
      }
    }
  }
}
