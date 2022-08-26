import { useSession, signIn, signOut } from "next-auth/react"
import ActionButton from "./actionButton";

export const AuthButtons = () => {
	const {data: session} = useSession();
	const buttonCSS = "my-auto bg-zinc-600 px-2 rounded-full hover:cursor-pointer hover:bg-purple-300 hover:text-zinc-800"
	return (
		<>
		{session ? 
			<ActionButton action={() => signOut()} caption="Sign Out"/> : 
			<ActionButton action={() => signIn('discord')} caption="Sign In"/>}
		</>
	)
}