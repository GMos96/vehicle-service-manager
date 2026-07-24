import { NextResponse } from "next/server";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { User } from "@/entities/user/user.entity";
import { IsEmail, IsNotEmpty, validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { getDataSource } from "@/core/datasource/data-source";
import { JWT_SECRET } from "@/core/env";
import { AUTH_STATUS_COOKIE, TOKEN_COOKIE } from "@/core/auth";
import { mapValidationErrors } from "@/core/validation";

class LoginDto {
  @IsEmail(undefined, { message: "Enter a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  emailAddress: string;

  @IsNotEmpty({ message: "Password is required" })
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
        { message: mapValidationErrors(errors), status: 400 },
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
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json({ user: userWithoutPassword });

    const maxAge = 60 * 60 * 24; // 1 day, matches token expiry
    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set(TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      path: "/",
      maxAge,
    });

    // Non-sensitive flag readable by client code to reflect auth state
    response.cookies.set(AUTH_STATUS_COOKIE, "1", {
      httpOnly: false,
      secure: isProduction,
      sameSite: "strict",
      path: "/",
      maxAge,
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
