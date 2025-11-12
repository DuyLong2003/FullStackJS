import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { hashPasswordHelper } from '@/helpers/util';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)// Inject model User để thao tác với MongoDB
    private userModel: Model<User>
  ) { }

  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email });
    if (user) return true;
    return false;
  }

  async create(createUserDto: CreateUserDto) {
    const { email, name, password, phone, address, image } = createUserDto;
    //check email
    const isExist = await this.isEmailExist(email);
    if (isExist) {
      throw new BadRequestException(`Email đã tồn tại: ${email}. Vui lòng sửa dụng email khác`)
    }
    //hash password
    const hashPassword = await hashPasswordHelper(createUserDto.password);
    //Lưu user vào MongoDB
    const user = await this.userModel.create({
      name, email, password: hashPassword, phone, address, image
    })
    //Trả về _id của user vừa tạo
    return {
      _id: user._id
    }
  }

  // Hàm lấy danh sách user có phân trang + lọc + sắp xếp
  async findAll(query: string, current: number, pageSize: number) {
    //  Parse query string (VD: ?email=john&sort=-createdAt)
    // => { filter: { email: 'john' }, sort: { createdAt: -1 } }
    const { filter, sort } = aqp(query);

    // Loại bỏ param phân trang khỏi filter để tránh ảnh hưởng query Mongo
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    // Gán giá trị mặc định nếu không có current/pageSize
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    // Tính tổng số phần tử
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);

    // Tính toán vị trí bắt đầu của trang hiện tại
    const skip = (current - 1) * pageSize;

    // Truy vấn Mongo với điều kiện lọc, phân trang và sắp xếp
    const result = await this.userModel
      .find(filter)             // Điều kiện lọc
      .limit(pageSize)          // Số lượng phần tử / trang
      .skip(skip)               // Bỏ qua phần tử của các trang trước
      .select('-password')      // Ẩn trường password vì lý do bảo mật
      .sort(sort as any);       // Sắp xếp (VD: sort=-createdAt)
    // Trả kết quả về cho controller
    return { result, totalPages };//Mảng user sau khi lọc + phân trang, Tổng số trang để frontend render pagination
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id }, { ...updateUserDto }
    );
  }

  async remove(_id: string) {
    //Check _id
    if (mongoose.isValidObjectId(_id)) {
      //delete
      return this.userModel.deleteOne({ _id })
    }
    else {
      throw new BadRequestException(`_id không đúng định dạng mongodb`);
    }
  }
}
