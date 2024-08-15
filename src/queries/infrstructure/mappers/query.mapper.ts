import { QueryDomain } from '../../../queries/domain/query';
import { QueryEntity } from '../entities/query.entity';
import { UserMapper } from '../../../users/infrastructure/mappers/user.mapper';
import { UserEntity } from '../../../users/infrastructure/entities/user.entity';

export class QueryMapper {
    static toDomain(raw: QueryEntity): QueryDomain {
        const query = new QueryDomain();
        console.log('raw ========== ',raw);
        
        query.id = raw.id;
        query.queryText = raw.queryText;
        query.response = raw.response;
        query.user = UserMapper.toDomain(raw.user);
        query.createdAt = raw.createdAt;
        query.updatedAt = raw.updatedAt;
        query.deletedAt = raw.deleteddAt;
        return query;
    }

    static toPersistence(query: QueryDomain): QueryEntity {
        const queryEntity = new QueryEntity();

        if (query.id && typeof query.id === 'string') {
            queryEntity.id = query.id;
        }
        queryEntity.queryText = query.queryText;
        queryEntity.response = query.response ? query.response : null;
        let user;
        if(query.user) {
            user = new UserEntity();
            user.id = query.user.id;
        }
        queryEntity.user = user;
        return queryEntity;
    }
}
