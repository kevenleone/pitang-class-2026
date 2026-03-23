import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import type { LoginSchema } from "@/zodSchemas";
import fetcher from "@/lib/fetcher";
import FetcherError from "@/lib/FetcherError";

function getCookie(cookieName: string) {
  return document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${cookieName}=`))
    ?.split("=")[1];
}

export function useAuth() {
  const navigate = useNavigate();

  async function getAuthenticatedUser() {
    return fetcher("/auth/me", {
      headers: {
        Authorization: `Bearer ${getCookie("@pitang/accessToken")}`,
      },
    });
  }

  async function handleLogout() {
    document.cookie = "@pitang/accessToken=; path=/; Max-Age=0";

    navigate({ to: "/login" });
  }

  async function handleLogin(data: LoginSchema) {
    try {
      const response = await fetcher.post("/auth/login", {
        expiresInMins: 90,
        username: data.username,
        password: data.password,
      });

      toast.success("Welcome...");

      document.cookie = `@pitang/accessToken=${response.accessToken}; path=/; Max-Age=86400`;

      navigate({ to: "/dashboard" });
    } catch (error) {
      if (error instanceof FetcherError) {
        toast.error(error.info.message);
      }
    }
  }

  return {
    getAuthenticatedUser,
    handleLogin,
    handleLogout,
  };
}
