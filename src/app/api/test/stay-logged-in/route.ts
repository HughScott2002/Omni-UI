import { NextResponse } from "next/server";

/**
 * Test API route for staying logged in during development
 * This bypasses the real backend authentication for testing purposes
 *
 * Usage:
 * - GET request: Returns mock user data
 * - Can be called from the frontend to simulate a logged-in state
 */

export async function GET() {
  // Mock user data matching the User interface from AuthContext
  const mockUser = {
    id: "test-user-123",
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    kycStatus: "verified",
  };

  // Return the same structure as the backend would
  return NextResponse.json(
    {
      user: mockUser,
      message: "Test user session active",
    },
    {
      status: 200,
      headers: {
        "Set-Cookie": [
          "access_token=test-access-token; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900",
          "refresh_token=test-refresh-token; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800",
        ].join(", "),
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    // Allow custom user data to be passed in the request
    const body = await request.json();

    const mockUser = {
      id: body.id || "test-user-123",
      email: body.email || "test@example.com",
      firstName: body.firstName || "Test",
      lastName: body.lastName || "User",
      kycStatus: body.kycStatus || "verified",
    };

    return NextResponse.json(
      {
        user: mockUser,
        message: "Test user session created",
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": [
            "access_token=test-access-token; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900",
            "refresh_token=test-refresh-token; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800",
          ].join(", "),
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        user: {
          id: "test-user-123",
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
          kycStatus: "verified",
        },
        message: "Test user session created with default data",
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": [
            "access_token=test-access-token; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900",
            "refresh_token=test-refresh-token; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800",
          ].join(", "),
        },
      }
    );
  }
}
