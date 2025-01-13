import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateMenuItemDto,
  UpdateMenuItemDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/menu.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllItems(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.menuItem.findMany({
        skip,
        take: limit,
        include: {
          category: true,
        },
      }),
      this.prisma.menuItem.count(),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getItemById(id: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!item) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }

    return item;
  }

  async createItem(dto: CreateMenuItemDto) {
    // Verify category exists
    const categoryExists = await this.prisma.menuCategory.findUnique({
      where: { id: dto.categoryId },
    });

    if (!categoryExists) {
      throw new NotFoundException(
        `Category with ID ${dto.categoryId} not found`,
      );
    }

    return this.prisma.menuItem.create({
      data: dto,
      include: {
        category: true,
      },
    });
  }

  async updateItem(id: string, dto: UpdateMenuItemDto) {
    // Check if item exists
    await this.getItemById(id);

    // If categoryId is provided, verify it exists
    if (dto.categoryId) {
      const categoryExists = await this.prisma.menuCategory.findUnique({
        where: { id: dto.categoryId },
      });

      if (!categoryExists) {
        throw new NotFoundException(
          `Category with ID ${dto.categoryId} not found`,
        );
      }
    }

    return this.prisma.menuItem.update({
      where: { id },
      data: dto,
      include: {
        category: true,
      },
    });
  }

  async deleteItem(id: string) {
    // Check if item exists
    await this.getItemById(id);

    return this.prisma.menuItem.delete({
      where: { id },
    });
  }

  async getAllCategories(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      this.prisma.menuCategory.findMany({
        skip,
        take: limit,
        include: {
          items: true,
        },
      }),
      this.prisma.menuCategory.count(),
    ]);

    return {
      data: categories,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCategoryById(id: string) {
    const category = await this.prisma.menuCategory.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async createCategory(dto: CreateCategoryDto) {
    return this.prisma.menuCategory.create({
      data: dto,
      include: {
        items: true,
      },
    });
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    // Check if category exists
    await this.getCategoryById(id);

    return this.prisma.menuCategory.update({
      where: { id },
      data: dto,
      include: {
        items: true,
      },
    });
  }

  async deleteCategory(id: string) {
    // Check if category exists
    await this.getCategoryById(id);

    return this.prisma.menuCategory.delete({
      where: { id },
    });
  }
}
