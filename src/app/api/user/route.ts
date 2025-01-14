import apiUrl from "@/config";
import { DeleteUserFormData } from "@/features/user/settings/ts/interface/settings-interfaces";
import { ResponseBody } from "@/shared/ts/interfaces/global";
import { User } from "@/shared/ts/interfaces/user.interface";
import { ParseRawError } from "@/shared/utils";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value ?? "";

  const deviceId = cookieStore.get("device-id")?.value ?? "";

  const res = await fetch(`${apiUrl}/user/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Device-ID": `${deviceId}`,
    },
    mode: "cors",
    method: "GET",
  });

  if (!res.ok) {
    // When the session is not found or expired.
    if (res.status === 404 || res.status === 410) cookieStore.delete("token");

    return await ParseRawError(res);
  }

  const newToken = res.headers.get("Authorization")?.split(" ")[1];

  if (newToken)
    cookieStore.set("token", newToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  else console.warn("Unexpected Error: new token not set.");

  const body: ResponseBody<User> = await res.json();

  const obj: User = body.data;

  return new Response(JSON.stringify(obj), {
    status: body.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE(req: NextRequest) {
  const body: DeleteUserFormData = await req.json();

  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value ?? "";

  const deviceId = cookieStore.get("device-id")?.value ?? "";

  const res = await fetch(`${apiUrl}/user/`, {
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Device-ID": `${deviceId}`,
    },
    mode: "cors",
    method: "DELETE",
  });

  if (!res.ok) return await ParseRawError(res);

  if (body.authAs === "LOCAL") cookieStore.delete("token");

  return new Response(JSON.stringify({}), {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
