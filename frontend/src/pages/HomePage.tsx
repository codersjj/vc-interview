import { useEffect, useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

const HomePage = () => {
  interface User {
    id: number;
    name: string;
    username: string;
    email: string;
  }

  // fetch some data without TanStack Query
  // const [users, setUsers] = useState<User[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<Error | null>(null);

  // useEffect(() => {
  //   const getUsers = async () => {
  //     setIsLoading(true);
  //     try {
  //       const res = await fetch("https://jsonplaceholder.typicode.com/users");
  //       const users = await res.json();
  //       setUsers(users);
  //     } catch (error) {
  //       setError(error as Error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   // refetch users if error occurs
  //   // fetch users immediately again when you focus on the window
  //   // ...

  //   getUsers();
  // }, []);

  // fetch some data with TanStack Query
  const { isPending, error, data } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      fetch("https://jsonplaceholder.typicode.com/users").then((res) =>
        res.json()
      ),
  });

  if (isPending) return "Loading...";

  if (error) {
    return "An error has occurred: " + error.message;
  }

  return (
    <div>
      <h1 className="p-10 text-3xl text-red-500 bg-amber-200">
        Welcome to VC Interview
      </h1>

      {/* {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <ul>
        {!isLoading &&
          !error &&
          users.map((user: User) => <li key={user.id}>{user.name}</li>)}
      </ul> */}

      <ul>
        {data.map((user: User) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>

      <button
        className="btn"
        onClick={() => toast.success("This is a success toast!")}
      >
        Default
      </button>
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
