import { NextPage } from "next";
import Link from "next/link";
import { BaseLayout } from "../components/baseLayout";

const Roadmap: NextPage = () => {
	return (
		<BaseLayout>
		<div className="h-screen flex flex-col gap-2 backdrop-blur-md select-none">
			<div className="p-2 bg-zinc-800 drop-shadow-md">
				<Link href="/"><div className="font-bold text-2xl text-purple-400 hover:cursor-pointer">Spark</div></Link>
			</div>
			<div className="p-4 container mx-auto select-all">
				<p className="text-4xl mb-4">Road to MVP</p>
				<div className="flex gap-2 mb-4">
					<div className="bg-green-300 p-4 mr-2 rounded-md" />
					<p className="text-xl my-auto">Authentication with Discord</p>
				</div>
				<div className="flex gap-2 mb-4">
					<div className="bg-green-300 p-4 mr-2 rounded-md" />
					<p className="text-xl my-auto">Real-time text chat with Channels</p>
				</div>
				<div className="flex gap-2 mb-4">
					<div className="bg-yellow-300 p-4 mr-2 rounded-md" />
					<p className="text-xl my-auto">User channel management</p>
				</div>
				<div className="flex gap-2 mb-4">
					<div className="bg-red-300 p-4 mr-2 rounded-md" />
					<p className="text-xl my-auto">Friendships</p>
				</div>
			</div>
		</div>
		</BaseLayout>
	);
};

export default Roadmap;