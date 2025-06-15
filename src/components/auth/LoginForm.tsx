'use client'

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/contexts/LanguageContext"
import { Nunito } from "next/font/google"
import { createLoginSchema, type LoginFormData } from "@/lib/validations/auth"
import { toast } from "sonner"
import { useAuthStore } from "@/store/useAuthStore"
import { useRouter } from 'next/navigation'
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';


const nunito = Nunito({ subsets: ["latin"] })
export function LoginForm() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const { t } = useLanguage()
    // const router = useRouter()
    const { login } = useAuthStore()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(createLoginSchema(t)),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    })
    const onSubmit = async (loginDataForm: LoginFormData) => {
        try {
            const { email, password } = loginDataForm
            await login(email, password, router)
        } catch (error: any) {
            const errorMsg =
                error?.response?.data?.message || "Đã có lỗi xảy ra, vui lòng thử lại!"
            toast.error("Đăng nhập thất bại", {
                description: errorMsg,
            })
        }
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email" className={`${nunito.className} text-base font-semibold text-foreground`}>
                        {t('login.email')}
                    </Label>
                    <Input
                        {...register("email")}
                        id="email"
                        placeholder="name@example.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        className={`h-12 rounded-xl border-2 bg-background px-4 text-base transition-colors focus:border-primary ${errors.email ? "border-destructive" : ""
                            }`}
                        aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password" className={`${nunito.className} text-base font-semibold text-foreground`}>
                        {t('login.password')}
                    </Label>
                    <div className="relative">
                        <Input
                            {...register("password")}
                            id="password"
                            placeholder={t('login.password')}
                            type={showPassword ? "text" : "password"}
                            autoCapitalize="none"
                            autoComplete="current-password"
                            autoCorrect="off"
                            className={`h-12 rounded-xl border-2 bg-background px-4 text-base transition-colors focus:border-primary ${errors.password ? "border-destructive" : ""
                                }`}
                            aria-invalid={!!errors.password}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-muted-foreground" />
                            ) : (
                                <Eye className="h-5 w-5 text-muted-foreground" />
                            )}
                            <span className="sr-only">
                                {showPassword ? "Hide password" : "Show password"}
                            </span>
                        </Button>
                        {errors.password && (
                            <p className="mt-2 text-sm text-destructive">{errors.password.message}</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <input
                        {...register("rememberMe")}
                        type="checkbox"
                        id="remember"
                        className="h-5 w-5 rounded-md border-2 border-primary text-primary focus:ring-primary"
                    />
                    <Label htmlFor="remember" className={`${nunito.className} text-sm font-medium text-muted-foreground`}>
                        {t('login.rememberMe')}
                    </Label>
                </div>
                <Link
                    href="/forgot-password"
                    className={`${nunito.className} text-sm font-medium text-primary hover:text-primary/80 hover:underline`}
                >
                    {t('login.forgotPassword')}
                </Link>
            </div>
            <div className="space-y-4">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={`${nunito.className} w-full h-12 rounded-xl bg-primary font-semibold text-base hover:bg-primary/90 transition-colors`}
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            {t('login.submitting')}
                        </span>
                    ) : (
                        t('login.submit')
                    )}
                </Button>
                <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-muted"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Hoặc</span>
                    </div>
                </div>

                {/* Nút đăng nhập Google */}
                <div className="flex justify-center">
                    <GoogleLoginButton />
                </div>
                <p className={`${nunito.className} text-center text-sm text-muted-foreground`}>
                    {t('login.noAccount')}{" "}
                    <Link href="/signup" className="font-semibold text-primary hover:text-primary/80 hover:underline">
                        {t('login.signUp')}
                    </Link>
                </p>
            </div>
        </form>
    )
} 