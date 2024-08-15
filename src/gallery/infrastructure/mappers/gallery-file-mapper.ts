import { GalleryFile } from "src/gallery/domain/gallery-files";
import { GalleryFilesEntity } from "../entities/gallery-files.entity";

export class GalleryFilesMapper {
    static toDomain(raw: GalleryFilesEntity): GalleryFile {
        const product = new GalleryFile();
        product.id = raw.file?.id;
        //product.isDefault = raw.isDefault!;
        product.path = raw.file?.path;

        return product;
    }
}