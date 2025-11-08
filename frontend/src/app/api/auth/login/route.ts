import { NextResponse } from "next/server";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { User } from "@/entities/user/user.entity";
import { IsEmail, IsNotEmpty, validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { getDataSource } from "@/core/datasource/data-source";

class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  emailAddress: string;

  @IsNotEmpty()
  password: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const loginDto = plainToInstance(LoginDto, body);
    const errors = await validate(loginDto);
    if (errors.length > 0) {
      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 400 },
      );
    }

    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { emailAddress: body.emailAddress },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Verify password
    const isValidPassword = await compare(body.password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Generate JWT token
    const token = sign(
      { userId: user.id, email: user.emailAddress },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" },
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
