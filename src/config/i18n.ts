export const languages = {
  en: { label: 'English', flag: '🇺🇸' },
  vi: { label: 'Tiếng Việt', flag: '🇻🇳' }
} as const;

export type Language = keyof typeof languages;

export const defaultLanguage: Language = 'en';

export const translations = {
  en: {
    nav: {
      kanji: 'Kanji',
      vocabulary: 'Vocabulary',
      study: 'Study',
      login: 'Login',
      signup: 'Sign Up'
    },
    login: {
      title: 'Welcome back',
      subtitle: 'Please enter your details to sign in to your account',
      email: 'Email',
      password: 'Password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      submit: 'Sign in',
      submitting: 'Signing in...',
      noAccount: "Don't have an account?",
      signUp: 'Sign up',
      errors: {
        email: {
          required: 'Email is required',
          invalid: 'Invalid email address'
        },
        password: {
          required: 'Password is required',
          minLength: 'Password must be at least 8 characters'
        }
      }
    },
    signup: {
      title: 'Create your account',
      subtitle: 'Start your Japanese learning journey today',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      acceptTerms: 'I accept the terms and conditions',
      submit: 'Sign up',
      submitting: 'Creating account...',
      haveAccount: 'Already have an account?',
      login: 'Log in',
      errors: {
        username: {
          required: 'Username is required',
          minLength: 'Username must be at least 3 characters',
          maxLength: 'Username must be at most 20 characters',
          invalid: 'Username can only contain letters, numbers, underscores, and hyphens'
        },
        email: {
          required: 'Email is required',
          invalid: 'Invalid email address'
        },
        password: {
          required: 'Password is required',
          minLength: 'Password must be at least 8 characters',
          requirements: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        },
        confirmPassword: {
          required: 'Please confirm your password',
          match: 'Passwords do not match'
        },
        acceptTerms: {
          required: 'You must accept the terms and conditions'
        }
      }
    },
    hero: {
      title: 'Master Japanese with Umeko',
      subtitle: 'Your personalized journey to Japanese fluency. Learn kanji, vocabulary, and track your progress with our intelligent spaced repetition system.',
      startLearning: 'Start Learning',
      learnMore: 'Learn More'
    },
    features: {
      kanji: {
        title: '漢字 Kanji Study',
        description: 'Master Japanese characters through structured learning paths',
        content: 'Learn kanji through radicals, mnemonics, and real-world examples. Progress from basic to advanced characters at your own pace.'
      },
      vocabulary: {
        title: '語彙 Vocabulary',
        description: 'Build your Japanese vocabulary systematically',
        content: 'Expand your vocabulary with context-based learning, example sentences, and audio pronunciation guides.'
      },
      srs: {
        title: 'SRS System',
        description: 'Optimize your learning with spaced repetition',
        content: 'Our intelligent system tracks your progress and adjusts review timing to help you remember what you\'ve learned effectively.'
      }
    }
  },
  vi: {
    nav: {
      kanji: 'Chữ Hán',
      vocabulary: 'Từ Vựng',
      study: 'Học Tập',
      login: 'Đăng Nhập',
      signup: 'Đăng Ký'
    },
    login: {
      title: 'Chào mừng trở lại',
      subtitle: 'Vui lòng nhập thông tin để đăng nhập vào tài khoản của bạn',
      email: 'Email',
      password: 'Mật khẩu',
      rememberMe: 'Ghi nhớ đăng nhập',
      forgotPassword: 'Quên mật khẩu?',
      submit: 'Đăng nhập',
      submitting: 'Đang đăng nhập...',
      noAccount: 'Chưa có tài khoản?',
      signUp: 'Đăng ký',
      errors: {
        email: {
          required: 'Email là bắt buộc',
          invalid: 'Địa chỉ email không hợp lệ'
        },
        password: {
          required: 'Mật khẩu là bắt buộc',
          minLength: 'Mật khẩu phải có ít nhất 8 ký tự'
        }
      }
    },
    signup: {
      title: 'Tạo tài khoản',
      subtitle: 'Bắt đầu hành trình học tiếng Nhật của bạn ngay hôm nay',
      username: 'Tên người dùng',
      email: 'Email',
      password: 'Mật khẩu',
      confirmPassword: 'Xác nhận mật khẩu',
      acceptTerms: 'Tôi đồng ý với điều khoản và điều kiện',
      submit: 'Đăng ký',
      submitting: 'Đang tạo tài khoản...',
      haveAccount: 'Đã có tài khoản?',
      login: 'Đăng nhập',
      errors: {
        username: {
          required: 'Tên người dùng là bắt buộc',
          minLength: 'Tên người dùng phải có ít nhất 3 ký tự',
          maxLength: 'Tên người dùng không được quá 20 ký tự',
          invalid: 'Tên người dùng chỉ có thể chứa chữ cái, số, gạch dưới và gạch ngang'
        },
        email: {
          required: 'Email là bắt buộc',
          invalid: 'Địa chỉ email không hợp lệ'
        },
        password: {
          required: 'Mật khẩu là bắt buộc',
          minLength: 'Mật khẩu phải có ít nhất 8 ký tự',
          requirements: 'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một số'
        },
        confirmPassword: {
          required: 'Vui lòng xác nhận mật khẩu',
          match: 'Mật khẩu không khớp'
        },
        acceptTerms: {
          required: 'Bạn phải đồng ý với điều khoản và điều kiện'
        }
      }
    },
    hero: {
      title: 'Học tiếng Nhật với Umeko',
      subtitle: 'Hành trình cá nhân hóa để thành thạo tiếng Nhật. Học Kanji, từ vựng và theo dõi tiến độ với hệ thống lặp lại ngắt quãng thông minh của chúng tôi.',
      startLearning: 'Bắt Đầu Học',
      learnMore: 'Tìm Hiểu Thêm'
    },
    features: {
      kanji: {
        title: '漢字 Kanji',
        description: 'Làm chủ chữ Hán qua lộ trình học có cấu trúc',
        content: 'Học kanji thông qua bộ thủ, phương pháp ghi nhớ và ví dụ thực tế. Tiến bộ từ cơ bản đến nâng cao theo tốc độ của riêng bạn.'
      },
      vocabulary: {
        title: '語彙 Từ Vựng',
        description: 'Xây dựng vốn từ tiếng Nhật một cách có hệ thống',
        content: 'Mở rộng vốn từ với việc học theo ngữ cảnh, câu ví dụ và hướng dẫn phát âm.'
      },
      srs: {
        title: 'Hệ Thống SRS',
        description: 'Tối ưu hóa việc học với phương pháp lặp lại ngắt quãng',
        content: 'Hệ thống thông minh của chúng tôi theo dõi tiến độ và điều chỉnh thời gian ôn tập để giúp bạn ghi nhớ hiệu quả những gì đã học.'
      }
    }
  }
} as const; 