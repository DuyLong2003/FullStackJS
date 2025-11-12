import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '@/decorator/customize';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Lấy danh sách user với filter / sort / pagination
  @Public()
  @Get()
  async findAll(
    @Query() query: string,           // Toàn bộ query string (VD: { email: 'john', sort: '-createdAt' })
    @Query("current") current: string, // Số trang hiện tại (VD: 1, 2, 3, ...)
    @Query("pageSize") pageSize: string // Số item mỗi trang
  ) {
    // Gọi sang service xử lý, ép kiểu sang number
    return this.usersService.findAll(query, +current, +pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }



  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
