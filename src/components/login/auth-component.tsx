"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/auth.tsx";
import {Link, useNavigate, useRouter} from "@tanstack/react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";

const baseSchema = {
  email: z.string().email().min(2, "E-mail is required"),
  password: z.string().min(3, "Password is required"),
};

// extended schema for registration
const registerSchema = z
  .object({
    ...baseSchema,
    confirmPassword: z.string().min(3, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const loginSchema = z.object(baseSchema);

type AuthComponentProps = {
  mode: "login" | "register";
};

export default function AuthComponent({ mode = "login" }: AuthComponentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, register } = useAuth();
  const router = useRouter();
  const navigate = useNavigate();

  const schema = mode === "login" ? loginSchema : registerSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      ...(mode === "register" ? { confirmPassword: "" } : {}),
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true);

    const { email, password } = values;

    if (mode === "login") {
      const result = await login({ email, password });

      if (result.success) {
        await router.invalidate();
        await navigate({ to: "/chat" });
      } else {
        setError(result.error || "Something went wrong");
      }
    } else {
      const errorMessage = await register({ email, password });
      if (errorMessage) {
        setError(errorMessage);
      } else {
        await router.invalidate();
        await navigate({ to: "/login" });
      }
    }

    setIsLoading(false);
  };

  // text state based on mode
  const title = mode === "login" ? "Login" : "Register";
  const description =
    mode === "login"
      ? "Enter your credentials to access your account"
      : "Create a new account";
  const buttonText = mode === "login" ? "Log in" : "Register";
  const loadingText = mode === "login" ? "Logging in..." : "Registering...";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your e-mail" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your password"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {mode === "register" && (
                  <div className="flex flex-col space-y-1.5">
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Confirm your password"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? loadingText : buttonText}
              </Button>
              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
              <div className="text-sm text-center mt-2">
                {mode === "login" ? (
                  <p>
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-primary hover:underline"
                    >
                      Register
                    </Link>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Login
                    </Link>
                  </p>
                )}
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
