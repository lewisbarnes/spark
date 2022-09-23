import PusherServer from 'pusher';
import Pusher from 'pusher-js';
import { env } from '../env/server.mjs';

export const pusherServer =  new PusherServer({
	appId: env.PUSHER_APP_ID,
	key: env.NEXT_PUBLIC_PUSHER_KEY,
	secret: env.PUSHER_SECRET,
	cluster: env.PUSHER_CLUSTER,
	useTLS: true,
})
