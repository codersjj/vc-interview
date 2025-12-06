import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'

function App() {
  return (
    <>
      <h1 className='p-10 text-3xl text-red-500 bg-amber-200'>Welcome to VC Interview</h1>
      <SignedOut>
        <SignInButton mode="modal">
          <button className=''>Login</button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <SignOutButton />
      </SignedIn>
      <UserButton />
    </>
  )
}

export default App
