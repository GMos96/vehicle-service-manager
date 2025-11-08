import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { User } from "@/entities/user/user.entity";
import { validate } from "class-validator";
import { getDataSource } from "@/core/datasource/data-source";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, emailAddress, password } = body;

    // Create user instance
    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.emailAddress = emailAddress;
    user.password = await hash(password, 10);

    // Validate user data
    const errors = await validate(user);
    if (errors.length > 0) {
      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 400 },
      );
    }

    // Get repository
    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);

    // Check if user exists
    const existingUser = await userRepository.findOne({
      where: { emailAddress },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 },
      );
    }

    // Save user
    const savedUser = await userRepository.save(user);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = savedUser;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
