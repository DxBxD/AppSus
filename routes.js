import HomePage from './views/HomePage.js'
import AboutUs from './views/AboutUs.js'
import Mail from './views/MailIndex.js'
import Keep from './views/Keep.js'

const { createRouter, createWebHashHistory } = VueRouter

const routerOptions = {
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			component: HomePage,
		},
		{
			path: '/about',
			component: AboutUs,
		},
		{
			path: '/mail',
			component: Mail,
		},
		{
			path: '/keep',
			component: Keep,
		},
	],
}

export const router = createRouter(routerOptions)
