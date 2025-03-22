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
import { createSignUpSchema, type SignUpFormData } from "@/lib/validations/auth"

const nunito = Nunito({ subsets: ["latin"] })

export function SignUpForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { t } = useLanguage()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(createSignUpSchema(t)),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            acceptTerms: false,
        },
    })

    const onSubmit = async (data: SignUpFormData) => {
        try {
            // TODO: Implement signup logic
            console.log(data)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="username" className={`${nunito.className} text-base font-semibold text-foreground`}>
                        {t('signup.username')}
                    </Label>
                    <Input
                        {...register("username")}
                        id="username"
                        type="text"
                        autoCapitalize="none"
                        autoComplete="username"
                        autoCorrect="off"
                        className={`h-12 rounded-xl border-2 bg-background px-4 text-base transition-colors focus:border-primary ${errors.username ? "border-destructive" : ""
                            }`}
                        aria-invalid={!!errors.username}
                    />
                    {errors.username && (
                        <p className="text-sm text-destructive">{errors.username.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className={`${nunito.className} text-base font-semibold text-foreground`}>
                        {t('signup.email')}
                    </Label>
                    <Input
                        {...register("email")}
                        id="email"
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
                        {t('signup.password')}
                    </Label>
                    <div className="relative">
                        <Input
                            {...register("password")}
                            id="password"
                            type={showPassword ? "text" : "password"}
                            autoCapitalize="none"
                            autoComplete="new-password"
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

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className={`${nunito.className} text-base font-semibold text-foreground`}>
                        {t('signup.confirmPassword')}
                    </Label>
                    <div className="relative">
                        <Input
                            {...register("confirmPassword")}
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            autoCapitalize="none"
                            autoComplete="new-password"
                            autoCorrect="off"
                            className={`h-12 rounded-xl border-2 bg-background px-4 text-base transition-colors focus:border-primary ${errors.confirmPassword ? "border-destructive" : ""
                                }`}
                            aria-invalid={!!errors.confirmPassword}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5 text-muted-foreground" />
                            ) : (
                                <Eye className="h-5 w-5 text-muted-foreground" />
                            )}
                            <span className="sr-only">
                                {showConfirmPassword ? "Hide password" : "Show password"}
                            </span>
                        </Button>
                        {errors.confirmPassword && (
                            <p className="mt-2 text-sm text-destructive">{errors.confirmPassword.message}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <input
                            {...register("acceptTerms")}
                            type="checkbox"
                            id="terms"
                            className="h-5 w-5 rounded-md border-2 border-primary text-primary focus:ring-primary"
                        />
                        <Label htmlFor="terms" className={`${nunito.className} text-sm font-medium text-muted-foreground`}>
                            {t('signup.acceptTerms')}
                        </Label>
                    </div>
                    {errors.acceptTerms && (
                        <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>
                    )}
                </div>
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
                            {t('signup.submitting')}
                        </span>
                    ) : (
                        t('signup.submit')
                    )}
                </Button>
                <p className={`${nunito.className} text-center text-sm text-muted-foreground`}>
                    {t('signup.haveAccount')}{" "}
                    <Link href="/login" className="font-semibold text-primary hover:text-primary/80 hover:underline">
                        {t('signup.login')}
                    </Link>
                </p>
            </div>
        </form>
    )
} 