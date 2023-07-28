import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class GetMarketListDto {
    @ApiPropertyOptional({
        description: '类型 market ship',
    })
    @IsString()
    @IsNotEmpty()
    public type: string;


    @ApiPropertyOptional({
        description: '页码',
    })
    @IsNumber()
    @IsNotEmpty()
    public pageIndex: number;

    @ApiPropertyOptional({
        description: '分页大小',
    })
    @IsNumber()
    @IsNotEmpty()
    public pageSize: number;



}