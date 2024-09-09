import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateReservationDto {

    @ApiProperty()
    @IsNotEmpty()
    private reservationDate: Date;

    @ApiProperty()
    @IsNotEmpty()
    private personCount: number;

    @ApiProperty()
    @IsNotEmpty()
    private branchId: string;

    @ApiProperty()
    @IsNotEmpty()
    private tableId: string;

    constructor(
        reservationDate: Date,
        personCount: number,
        branchId: string,
        tableId: string,
    ) {
        this.reservationDate = reservationDate;
        this.personCount = personCount;
        this.branchId = branchId;
        this.tableId = tableId;
    }

    // Getters
    get getReservationDate(): Date {
        return this.reservationDate;
    }

    get getPersonCount(): number | undefined {
        return this.personCount;
    }

    get getBranchId(): string {
        return this.branchId;
    }

    get getTableId(): string {
        return this.tableId;
    }

    // Setters
    set setReservationDate(value: Date) {
        this.reservationDate = value;
    }

    set setPersonCount(value: number) {
        this.personCount = value;
    }

    set setBranchId(value: string) {
        this.branchId = value;
    }

    set setTableId(value: string) {
        this.tableId = value;
    }

}


