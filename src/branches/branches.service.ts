import { HttpStatus, Injectable } from '@nestjs/common';
import { AbstractBranchRepository } from './infrastructure/repositories/abstract-branches.repository';
import { CreateBranchDto } from './dto/create-branch.dto';
import { Branch } from './domain/branch.domain';
import { CustomException } from '../exception/common-exception';
import { FilterBranchDto } from './dto/filter-branch.dto';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { InfinityPaginationResultType } from '../utils/types/infinity-pagination-result.type';
import { NullableType } from '../utils/types/nullable.type';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { FacilitiesService } from '../facilities/facilities.service';
import { Facility } from '../facilities/domain/facility';

@Injectable()
export class BranchesService {
    constructor(private readonly branchReposiiry: AbstractBranchRepository, private readonly facilityService: FacilitiesService) { }

    async create(createDto: CreateBranchDto): Promise<Branch> {
        const isNameExist = await this.findOne({
            name: createDto.getName.trim(),
        });

        if (isNameExist && isNameExist.deletedAt === null) {
            throw new CustomException(
                'branch name already exists',
                HttpStatus.NOT_ACCEPTABLE,
            );
        }

        let facilities: Facility[] = [];
        if (createDto.getFacilities) {
            for (const facility of createDto.getFacilities) {
                const fclt = await this.facilityService.findOne({ id: facility })
                if (!fclt) {
                    throw new CustomException('Facility does not exists', HttpStatus.NOT_FOUND);
                }
                facilities.push(fclt);


            }
        }

        const branch = {
            name: createDto.getName,
            description: createDto.getDescription,
            fiels: createDto.getFiles,
            facilities
        };

        return await this.branchReposiiry.create(branch);
    }

    findManyWithPagination({
        filterOptions, paginationOptions,
    }: {
        filterOptions?: FilterBranchDto | null;
        paginationOptions: IPaginationOptions;
    }): Promise<InfinityPaginationResultType<Branch>> {
        return this.branchReposiiry.findManyWithPagination({
            filterOptions,
            paginationOptions,
        });
    }

    findOne(fields: EntityCondition<Branch>): Promise<NullableType<Branch>> {
        return this.branchReposiiry.findOne(fields);
    }

    async update(
        id: string,
        updateData: UpdateBranchDto,
    ): Promise<Branch> {
        const existingBranch = await this.branchReposiiry.findOne({
            id: id,
        });
        if (!existingBranch) {
            throw new CustomException('Branch not found', HttpStatus.NOT_FOUND);
        }

        if (existingBranch.name !== updateData.getName) {
            const branchbyName = await this.findOne({ name: updateData.getName });
            if (branchbyName && branchbyName.id !== existingBranch.id) {
                throw new CustomException(
                    'product name already exists',
                    HttpStatus.CONFLICT,
                );
            }
        }

        let facilities: Facility[] = [];
        if (updateData.getFacilities) {
            for (const facility of updateData.getFacilities) {
                const fclt = await this.facilityService.findOne({ id: facility })
                if (!fclt) {
                    throw new CustomException('Facility does not exists', HttpStatus.NOT_FOUND);
                }
                facilities.push(fclt);


            }
        }

        const productDomain = {
            id: id,
            ...updateData,
            facilities
        }
        return this.branchReposiiry.update(id, productDomain);
    }

    async softDelete(id: Branch['id']): Promise<void> {
        await this.branchReposiiry.softDelete(id);
    }
}
