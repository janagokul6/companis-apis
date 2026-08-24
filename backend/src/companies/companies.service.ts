import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCompanyDto) {
    return this.prisma.company.create({
      data: {
        companyName: dto.companyName,
        website: dto.website,
        industry: dto.industry,
        employeeCount: dto.employeeCount,
      },
    });
  }

  findAll(search?: string) {
    const trimmed = search?.trim();

    return this.prisma.company.findMany({
      where: trimmed
        ? {
            companyName: {
              contains: trimmed,
              mode: 'insensitive',
            },
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string) {
    try {
      await this.prisma.company.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Company with id "${id}" not found`);
      }
      throw error;
    }
  }
}
