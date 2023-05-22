import { User as UserIcon } from 'lucide-react'

export function SignIn() {
  return (
    <a
      href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`}
      className="group flex items-center gap-3 text-left transition-colors hover:text-gray-50"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[100%] bg-gray-400 transition-border duration-500 group-hover:rounded-lg">
        <UserIcon className="h-5 w-5 text-gray-500" />
      </div>
      <p className="max-w-[140px] text-sm leading-snug">
        <span className="underline">Crie sua conta</span> e salve suas memórias!
      </p>
    </a>
  )
}
