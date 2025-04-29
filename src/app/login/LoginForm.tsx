import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";


import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Split the schema based on the step
const EmailSchema = z.object({
  email: z.string().email("Email inválido"),
  otp: z.string(),
});

const OTPSchema = z.object({
  email: z.string(),
  otp: z.string().min(6, "Código OTP deve ter pelo menos 6 caracteres"),
});

type LoginFormProps = {
  setIsLoginDone: React.Dispatch<React.SetStateAction<boolean>>;
} & React.ComponentPropsWithoutRef<"form">;

export function LoginForm({ className, setIsLoginDone, ...props }: LoginFormProps) {
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof EmailSchema>>({
    resolver: zodResolver(isOTPSent ? OTPSchema : EmailSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  async function onSubmit(data: z.infer<typeof EmailSchema>) {
    console.log("Form submitted with data:", data);
    console.log("isOTPSent:", isOTPSent);

    if (!isOTPSent) {
      try {
        console.log("Sending email verification...");
   
        //await axios.post(`/api/send-otp`, { email: data.email });
        setUserEmail(data.email);
        form.setValue('otp', ''); // Reset OTP field when switching to OTP view
        setIsOTPSent(true);
      } catch (error) {
        console.error("Error sending OTP:", error);
        alert("Erro ao enviar o código OTP");
      }
    } else {
      try {
        console.log("Verifying OTP...");
        //await axios.post(`/api/verify-otp`, { 
        //   email: userEmail,
        //  otp: data.otp 
        //});
 
        // Store authentication state
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', userEmail); 
        setIsLoginDone(true);
        navigate("/home");
      } catch (error) {
        console.error("Error verifying OTP:", error);
        alert("Código OTP inválido");
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">
            {!isOTPSent ? "Logar na sua conta" : "Confirmar acesso"}
          </h1>
          <p className="text-balance text-sm text-muted-foreground">
            {!isOTPSent 
              ? "Insira o seu e-mail para receber um código de acesso"
              : "Digite o código enviado para seu email"}
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className={isOTPSent ? 'hidden' : ''}>
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
              name="otp"
              render={({ field }) => (
                <FormItem className={!isOTPSent ? 'hidden' : ''}>
                  <FormLabel className="block text-left">Confirmar</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Digite o código recebido"
                      type="text"
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
            {!isOTPSent ? "Login" : "Confirmar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
