import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'
import './App.css'

function App() {
  return (
    <>
      <h1>Welcome to VC Interview</h1>
      <SignedOut>
        <SignInButton mode="modal">
          <button className=''>Sign in please</button>
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
