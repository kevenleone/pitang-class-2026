import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import type { SignInForm } from "@/components/login-form";
import { type SubmitEvent } from "react";

const baseURL = "https://dummyjson.com";

function getCookie(cookieName: string) {
  return document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${cookieName}=`))
    ?.split("=")[1];
}

export function useAuth() {
  const navigate = useNavigate();

  async function getAuthenticatedUser() {
    const response = await fetch("https://dummyjson.com/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getCookie("@pitang/accessToken")}`,
      },
    });

    if (!response.ok) {
      return toast.error("Something went wrong");
    }

    return response.json();
  }

  async function handleLogout() {
    document.cookie = "@pitang/accessToken=; path=/; Max-Age=0";

    navigate({ to: "/login" });
  }

  async function handleLogin(
    event: SubmitEvent<HTMLFormElement>,
    data: SignInForm,
  ) {
    event.preventDefault();

    const response = await fetch(`${baseURL}/auth/login`, {
      body: JSON.stringify({
        expiresInMins: 90,
        username: data.username,
        password: data.password,
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    const json = await response.json();

    if (!response.ok) {
      return toast.error(json.message);
    }

    toast.success("Welcome...");

    document.cookie = `@pitang/accessToken=${json.accessToken}; path=/; Max-Age=86400`;

    navigate({ to: "/dashboard" });
  }

  return {
    getAuthenticatedUser,
    handleLogin,
    handleLogout,
  };
}
