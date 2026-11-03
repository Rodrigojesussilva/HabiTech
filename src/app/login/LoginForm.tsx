import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from '@/lib/router-compat';
import { DEMO_AUTH_TOKEN } from '@/service/demo.api';
import { backendApi, isBackendApiConfigured } from "@/service/backend.api";


import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Login schema with email and password
const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type LoginFormProps = {
  setIsLoginDone: React.Dispatch<React.SetStateAction<boolean>>;
} & React.ComponentPropsWithoutRef<"form">;

export function LoginForm({ className, setIsLoginDone, ...props }: LoginFormProps) {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof LoginSchema>) {
    setLoginError("");
    setIsSubmitting(true);
    try {
      const email = data.email.trim().toLocaleLowerCase("pt-BR");
      let accessToken: string;
      let expiresAt: string | null = null;

      if (isBackendApiConfigured) {
        try {
          const response = await backendApi.post<{
            email: string;
            accessToken: string;
            expiresAtUtc: string;
          }>("/api/auth/login", data, {
            headers: { "X-Login-Email": email },
          });
          accessToken = response.data.accessToken;
          expiresAt = response.data.expiresAtUtc;
          localStorage.setItem("userEmail", response.data.email);
        } catch (error) {
          const cachedEmail = localStorage.getItem("userEmail")?.toLocaleLowerCase("pt-BR");
          const cachedToken = localStorage.getItem("authToken");
          const cachedExpiry = Date.parse(localStorage.getItem("authTokenExpiresAt") ?? "");
          const isNetworkFailure = axios.isAxiosError(error)
            && (!error.response || error.response.status >= 500);

          if (!isNetworkFailure) {
            throw error;
          }

          if (cachedEmail === email
            && cachedToken
            && cachedToken !== DEMO_AUTH_TOKEN
            && cachedExpiry > Date.now()) {
            accessToken = cachedToken;
            expiresAt = new Date(cachedExpiry).toISOString();
          } else {
            const validOfflineLogin = email === "demo@example.test" && data.password === "demo2025";
            if (!validOfflineLogin) throw error;
            accessToken = DEMO_AUTH_TOKEN;
          }
        }
      } else {
        const isValidUser = email === "demo@example.test" && data.password === "demo2025";
        if (!isValidUser) throw new Error("E-mail ou senha inválidos.");
        accessToken = DEMO_AUTH_TOKEN;
      }

      localStorage.setItem("isAuthenticated", "true");
      if (!isBackendApiConfigured || accessToken === DEMO_AUTH_TOKEN) {
        localStorage.setItem("userEmail", email);
      }
      localStorage.setItem("authToken", accessToken);
      if (expiresAt) localStorage.setItem("authTokenExpiresAt", expiresAt);
      else localStorage.removeItem("authTokenExpiresAt");
      setIsLoginDone(true);
      navigate("/home");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.status === 401
          ? "E-mail ou senha inválidos."
          : "Não foi possível acessar a API. Verifique a conexão e tente novamente."
        : error instanceof Error
          ? error.message
          : "Não foi possível entrar no sistema.";
      setLoginError(message);
      if (!axios.isAxiosError(error) && !(error instanceof Error)) {
        console.error("Erro inesperado no login:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`flex flex-col gap-7 ${className ?? ""}`} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950">
            Entrar na sua conta
          </h2>
          <p className="text-balance text-sm leading-relaxed text-slate-600">
            {isBackendApiConfigured
              ? "Acesso demonstrativo: demo@example.test · senha demo2025. Rascunhos ficam salvos localmente e sincronizam quando a API estiver disponível."
              : "Demonstração local: demo@example.test · senha demo2025"}
          </p>
        </div>
        <div className="grid gap-5">
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-left">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="h-12 rounded-xl bg-slate-50 px-4 focus-visible:bg-white"
                      placeholder="seu.email@example.test"
                      type="email"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-left">Senha</FormLabel>
                  <FormControl>
                    <Input
                      className="h-12 rounded-xl bg-slate-50 px-4 focus-visible:bg-white"
                      placeholder="Digite sua senha"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl bg-blue-700 text-base font-semibold shadow-md shadow-blue-900/15 transition hover:bg-blue-800"
          >
            {isSubmitting ? "Entrando..." : "Acessar sistema"}
          </Button>
          {loginError && <p className="text-sm text-red-700" role="alert">{loginError}</p>}
        </div>
      </form>
    </FormProvider>
  );
}
