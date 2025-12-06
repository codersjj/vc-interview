import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/clerk-react";

const HomePage = () => {
  return (
    <div>
      <h1 className="p-10 text-3xl text-red-500 bg-amber-200">
        Welcome to VC Interview
      </h1>
      <button className="btn">Default</button>
      <button className="btn btn-primary">Click me</button>
      <button className="btn btn-secondary">Click me</button>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="">Login</button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <SignOutButton />
      </SignedIn>
      <UserButton />
    </div>
  );
};

export default HomePage;
