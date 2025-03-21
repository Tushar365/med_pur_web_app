import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Pill, User, KeyRound, Mail, UserPlus, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Login form schema
const loginFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Registration form schema
const registrationFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  role: z.string().default("staff"),
  franchiseId: z.number().optional().nullable(),
  isActive: z.boolean().default(true),
});

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Registration form
  const registrationForm = useForm<z.infer<typeof registrationFormSchema>>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      email: "",
      role: "staff",
      franchiseId: null,
      isActive: true,
    },
  });

  const onLoginSubmit = (data: z.infer<typeof loginFormSchema>) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: z.infer<typeof registrationFormSchema>) => {
    // Create a full name by combining first and last name for the backend
    const userData = {
      ...data,
      fullName: `${data.firstName} ${data.lastName}` // Add fullName for backend compatibility
    };
    registerMutation.mutate(userData);
  };

  const isLoginPending = loginMutation.isPending;
  const isRegisterPending = registerMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Left Side - Forms */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center mb-4">
              <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center text-white p-2">
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L7 6V18L12 22L17 18V6L12 2Z" fill="currentColor" />
                  <path d="M12 6V12M9 9H15" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M8 16H16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M10 19H14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">MedSync</h1>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Welcome to MedSync
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your complete medicine ordering and inventory management solution for Indian pharmacies
            </p>
          </div>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login to your account</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800 text-sm">
                    <p className="font-medium mb-1">Development Environment</p>
                    <p>You can register a new account or use these demo credentials:</p>
                    <p className="mt-1"><strong>Username:</strong> admin</p>
                    <p><strong>Password:</strong> password123</p>
                  </div>

                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Your username" className="pl-8" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <KeyRound className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input type={showPassword ? "text" : "password"} placeholder="Your password" className="pl-8" {...field} />
                                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2">
                                  {showPassword ? "Hide" : "Show"}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={isLoginPending}>
                        {isLoginPending ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...</>
                        ) : (
                          "Login"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="link" onClick={() => setActiveTab("register")}>
                    Don't have an account? Register
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>
                    Register for access to the MedSync system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registrationForm}>
                    <form onSubmit={registrationForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={registrationForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input placeholder="First name" className="pl-8" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registrationForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Last name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={registrationForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input type="email" placeholder="Your email address" className="pl-8" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registrationForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Choose a username" className="pl-8" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registrationForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <KeyRound className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input type={showRegisterPassword ? "text" : "password"} placeholder="Create a password" className="pl-8" {...field} />
                                <button onClick={() => setShowRegisterPassword(!showRegisterPassword)} className="absolute right-2 top-1/2 -translate-y-1/2">
                                  {showRegisterPassword ? "Hide" : "Show"}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={isRegisterPending}>
                        {isRegisterPending ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</>
                        ) : (
                          "Register"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="link" onClick={() => setActiveTab("login")}>
                    Already have an account? Login
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Side - Hero */}
      <div className="flex-1 bg-primary p-8 text-white hidden md:flex md:flex-col md:justify-center">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <div className="w-20 h-20 rounded-md bg-white flex items-center justify-center text-primary p-3">
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L7 6V18L12 22L17 18V6L12 2Z" fill="currentColor" />
                <path d="M12 6V12M9 9H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M8 16H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M10 19H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-6">
            Streamline Your Medical Store Operations
          </h2>
          <p className="text-lg mb-6">
            MedSync provides a comprehensive solution for managing your Indian pharmacy's inventory, 
            tracking customers, and processing orders with GST support.
          </p>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white text-primary flex items-center justify-center mr-3">
                ✓
              </div>
              <p>Complete inventory management with low stock alerts</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white text-primary flex items-center justify-center mr-3">
                ✓
              </div>
              <p>Customer database with comprehensive profiles</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white text-primary flex items-center justify-center mr-3">
                ✓
              </div>
              <p>Efficient order processing and tracking</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white text-primary flex items-center justify-center mr-3">
                ✓
              </div>
              <p>Insightful dashboard with key business metrics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}