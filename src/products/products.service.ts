import { PaginationDto } from './../common/dto/pagination.dto';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');
  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to the database');
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;

    const totalPage = await this.product.count();

    const lastPage = Math.ceil(totalPage / limit);

    return {
      data: await this.product.findMany({
        take: limit,
        skip: (page - 1) * limit,
      }),
      meta: {
        totalPage,
        currentPage: page,
        perPage: limit,
        lastPage,
      },
    };
  }

  findOne(id: number) {
    const product = this.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: __, ...data } = updateProductDto;

    await this.findOne(id);

    return this.product.update({
      where: {
        id,
      },
      data: data,
    });
  }

  remove(id: number) {
    try {
      return this.product.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new Error('Product not found');
    }
  }
}
