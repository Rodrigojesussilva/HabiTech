import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Schema de validação com Zod
const FormSchema = z.object({
  email: z.string().min(3, "Email incorreto"),
  senha: z.string().min(3, "Senha incorreta"),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange", // Validação acontece conforme o usuário digita
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  function teste(name: any) {
    console.log(name);
  }
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      console.log(data);
      await axios.post(`http://www.uol.com.br`, data, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Dados salvos com sucesso!");
    } catch (error) {
      alert("Erro ao salvar");
    }
  }
  const navigate = useNavigate();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Logar na sua conta</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Insira o seu e-mail e senha abaixo para logar na sua conta
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2 ">

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem >
                  <FormLabel className="block text-left">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="patricia2@sehab.org.br"  {...field} onChange={(e) => {
                      // Dispara a função toda vez que o campo for alterado
                      field.onChange(e);  // Não esqueça de chamar a função original do React Hook Form
                      teste("nada"); // Função personalizada
                    }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>
          <div className="grid gap-2">

            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem >
                  <FormLabel className="block text-left">Senha</FormLabel>
                  <FormControl>
                    <Input  type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Esqueceu sua senha?
            </a>
          </div>
          <Button type="button" onClick={() => navigate("/home")} className="w-full">
            Login
          </Button>
        </div>
        <div className="text-center text-sm">
          Não tem uma conta?{" "}
          <a href="#" className="underline underline-offset-4">
            Cadastrar conta
          </a>
        </div>
      </form>
    </Form>
  )
}
