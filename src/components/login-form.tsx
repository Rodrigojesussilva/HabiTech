import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Logar na sua conta</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Insira o seu e-mail e senha abaixo para logar na sua conta
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email" className="block text-left">Email</Label>
          <Input id="email" type="text" placeholder="patricia@sehab.org.br" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Senha</Label>
          </div>
          <Input id="password" type="password" required />
          <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Esqueceu sua senha?
            </a>
        </div>
        <Button type="submit" className="w-full">
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
  )
}
