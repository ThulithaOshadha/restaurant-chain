import { GalleryFile } from "./gallery-files";

export class Gallery {
    id: string;
    files?: GalleryFile[];
    description?: string;
    queryText: string;
    response?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}