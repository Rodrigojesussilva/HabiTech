import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from '@/lib/router-compat';
import { DEMO_AUTH_TOKEN } from '@/service/demo.api';


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
      const isValidUser = email === "demo@example.test" && data.password === "demo2025";
      if (!isValidUser) throw new Error("E-mail ou senha inválidos.");

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("authToken", DEMO_AUTH_TOKEN);
      localStorage.removeItem("authTokenExpiresAt");
      setIsLoginDone(true);
      navigate("/home");
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "Não foi possível entrar no sistema.";
      setLoginError(message);
      if (!(error instanceof Error)) {
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
            Acesso demonstrativo: demo@example.test · senha demo2025. Rascunhos ficam salvos localmente e sincronizam quando a API estiver disponível.
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
