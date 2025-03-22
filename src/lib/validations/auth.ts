import * as z from "zod"

export const createLoginSchema = (t: (key: string) => string) => {
    return z.object({
        email: z
            .string()
            .min(1, { message: t('login.errors.email.required') })
            .email({ message: t('login.errors.email.invalid') }),
        password: z
            .string()
            .min(1, { message: t('login.errors.password.required') })
            .min(8, { message: t('login.errors.password.minLength') }),
        rememberMe: z.boolean().default(false),
    })
}

export const createSignUpSchema = (t: (key: string) => string) => {
    return z.object({
        username: z
            .string()
            .min(1, { message: t('signup.errors.username.required') })
            .min(3, { message: t('signup.errors.username.minLength') })
            .max(20, { message: t('signup.errors.username.maxLength') })
            .regex(/^[a-zA-Z0-9_-]+$/, { message: t('signup.errors.username.invalid') }),
        email: z
            .string()
            .min(1, { message: t('signup.errors.email.required') })
            .email({ message: t('signup.errors.email.invalid') }),
        password: z
            .string()
            .min(1, { message: t('signup.errors.password.required') })
            .min(8, { message: t('signup.errors.password.minLength') })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
                message: t('signup.errors.password.requirements') 
            }),
        confirmPassword: z
            .string()
            .min(1, { message: t('signup.errors.confirmPassword.required') }),
        acceptTerms: z
            .boolean()
            .refine((val) => val === true, {
                message: t('signup.errors.acceptTerms.required')
            })
    }).refine((data) => data.password === data.confirmPassword, {
        message: t('signup.errors.confirmPassword.match'),
        path: ["confirmPassword"],
    })
}

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>
export type SignUpFormData = z.infer<ReturnType<typeof createSignUpSchema>> 