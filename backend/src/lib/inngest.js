import { Inngest } from "inngest";
import User from "../models/User.js";
import { connectDB } from "./db.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "vc-interview" });

// see: https://www.inngest.com/docs/guides/clerk-webhook-events
// Your new function:
const syncUser = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event, step }) => {
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } = event.data

    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address || "",
      name: `${first_name || ''} ${last_name || ''}`,
      profileImage: image_url || ""
    }

    await new User(newUser).save()
    console.log("✅ Synced user from Clerk to MongoDB:", newUser);

    await upsertStreamUser({
      id: newUser.clerkId.toString(),
      name: newUser.name,
      image: newUser.profileImage
    })
  },
);

const deleteUser = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event, step }) => {
    await connectDB();

    const { id } = event.data

    await User.deleteOne({ clerkId: id })
    console.log("✅ Deleted user from MongoDB:", id);

    await deleteStreamUser(id.toString())
  },
);

// Add the function to the exported array:
export const functions = [
  syncUser,
  deleteUser
];