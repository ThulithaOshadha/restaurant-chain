import { GalleryEntity } from '../entities/gallery.entity';
import { Gallery } from 'src/gallery/domain/gallery';
import { GalleryFilesMapper } from './gallery-file-mapper';

export class GalleryMapper {
    static toDomain(raw: GalleryEntity): Gallery {
        const gallery = new Gallery();
        gallery.id = raw.id;
        gallery.description = raw.description!;
        gallery.files = raw.file.map((file) => GalleryFilesMapper.toDomain(file));
        gallery.createdAt = raw.createdAt;
        gallery.updatedAt = raw.updatedAt;
        gallery.deletedAt = raw.deleteddAt;
        return gallery;
    }

    static toPersistence(gallery: Gallery): GalleryEntity {
        const galleryEntity = new GalleryEntity();

        if (gallery.id && typeof gallery.id === 'string') {
            galleryEntity.id = gallery.id;
        }
        galleryEntity.description = gallery.description!;
        return galleryEntity;
    }
}
