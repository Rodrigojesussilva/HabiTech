import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from 'react-router-dom';


import {
  Form,
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
    console.log("Form submitted with data:", data);

    try {
      console.log("Authenticating user...");
      
      // TODO: Replace with actual API call
      // await axios.post(`/api/login`, { 
      //   email: data.email,
      //   password: data.password 
      // });
      // Usuários válidos
      const validUsers = [
        { email: "piloto@sehab.sp.gov.br", password: "sehab2025" },
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

      // Store authentication state
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', data.email); 
      setIsLoginDone(true);
      navigate("/home");
    } catch (error) {
      console.error("Error during authentication:", error);
      alert("Email ou senha inválidos");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">
            Entrar na sua conta
          </h1>
          <p className="text-balance text-sm text-muted-foreground">
            Digite seu email e senha para acessar o sistema
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-left">Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="patricia2@sehab.org.br" 
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
            className="w-full"
            onClick={() => console.log("Button clicked")}
          >
            Entrar
          </Button>
        </div>
      </form>
    </Form>
  );
}
