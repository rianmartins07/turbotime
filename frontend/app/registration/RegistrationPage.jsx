'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import EditText from '@/components/ui/EditText';
import { authAPI } from '@/api';

export default function RegistrationPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
      setError('')
      setIsLoading(true)

    if (!email || !password) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setIsLoading(false)
      return
    }

    try {
      if (isLogin) {
        await authAPI.login(email, password)
      } else {
        await authAPI.register(email, password)
      }
      
      router.push('/dashboard')
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  const handleSignInClick = () => {
    setIsLogin(!isLogin)
    setError('')
  }

  return (
    <main className="w-full min-h-screen bg-[#faf1e3] flex flex-col justify-start items-center">
      <div className="w-full max-w-[1440px] mx-auto flex flex-col justify-start items-center px-4 sm:px-6 lg:px-8">
        
        <div className="w-full max-w-[384px] flex flex-col items-center mt-[96px] md:mt-[144px] lg:mt-[192px]">
          <div className="mb-[6px] md:mb-[8px] lg:mb-[12px] flex justify-center">
            <Image 
              src={isLogin ? "/images/cacto.png" : "/images/cat.png"}
              alt={isLogin ? "Cute cactus mascot" : "Cute cat mascot"}
              width={0}
              height={0}
              sizes="100vw"
              className="w-auto h-auto"
              priority
            />
          </div>

          <h1 className="text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] font-bold leading-[29px] sm:leading-[38px] md:leading-[48px] lg:leading-[58px] text-center text-[#88632a] font-inria mb-[18px] md:mb-[27px] lg:mb-[36px]">
            {isLogin ? 'Welcome Back!' : 'Yay, New Friend!'}
          </h1>

          {error && (
            <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-[12px]">
          <div className="w-full">
            <EditText
                type="email"
                placeholder="Email address"
                value={email}
                onChange={handleEmailChange}
                required
            />
            </div>

          <div className="w-full relative">
            <EditText
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
              layout_width="100%"
              padding="10px 30px 10px 14px"
              className="w-full pr-[30px]"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-[12px] top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <Image
                src="/images/img_iconography_caesarzkn.svg"
                alt="Toggle password visibility"
                width={16}
                height={16}
                className="w-4 h-4"
              />
            </button>
          </div>

          <div className="w-full flex flex-col items-center gap-[12px] mt-[30px] md:mt-[36px] lg:mt-[42px]">
            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              layout_width="100%"
              padding="10px 34px"
              className="w-full"
            >
              {isLoading 
                ? (isLogin ? 'Signing In...' : 'Creating Account...') 
                : (isLogin ? 'Sign In' : 'Sign Up')
              }
            </Button>

            <button
              type="button"
              onClick={handleSignInClick}
              className="text-[12px] font-normal leading-[15px] text-[#957139] underline font-inria hover:text-[#88632a] transition-colors duration-200"
            >
              {isLogin ? 'New here? Sign up!' : 'We’re already friends!'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </main>
  )
}