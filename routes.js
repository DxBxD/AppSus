import HomePage from './views/HomePage.js'
import AboutUs from './views/AboutUs.js'

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
	],
}

export const router = createRouter(routerOptions)
