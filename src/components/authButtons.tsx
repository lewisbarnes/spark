import { useSession, signIn, signOut } from "next-auth/react"
import ActionButton from "./actionButton";

export const AuthButtons = () => {
	const {data: session} = useSession();
	return (
		<>
		{session ? 
			<ActionButton action={() => signOut()} caption="Sign Out"/> : 
			<ActionButton action={() => signIn('discord')} caption="Sign In"/>}
		</>
	)
}