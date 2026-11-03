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

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof LoginSchema>) {
    try {
      const validUsers = [
        { email: "piloto@sehab.gov.br", password: "sehab2025" },
        { email: "urbhis@sehab.sp.gov.br", password: "sehab2025" },
        { email: "diagonal@sehab.sp.gov.br", password: "sehab2025" },
        { email: "cobrape@sehab.sp.gov.br", password: "sehab2025" }
      ];
      
      const isValidUser = validUsers.some(user => 
        user.email === data.email && user.password === data.password
      );
      
      if (!isValidUser) {
        throw new Error("Email ou senha inválidos");
      }

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', data.email); 
      localStorage.setItem('authToken', DEMO_AUTH_TOKEN);
      setIsLoginDone(true);
      navigate("/home");
    } catch (error) {
      console.error("Erro no login demonstrativo:", error);
      alert("Email ou senha inválidos");
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
            Acesse com piloto@sehab.gov.br e senha sehab2025
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
                      placeholder="seu.email@sehab.gov.br"
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
            className="h-12 w-full rounded-xl bg-blue-700 text-base font-semibold shadow-md shadow-blue-900/15 transition hover:bg-blue-800"
          >
            Acessar sistema
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
