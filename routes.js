import HomePage from './views/HomePage.js'
import AboutUs from './views/AboutUs.js'
import Mail from './views/MailIndex.js'
import Keep from './views/KeepIndex.js'
import NoteDetails from './apps/keep/cmps/NoteDetails.js'
import MailList from './apps/mail/cmps/MailList.js'
import MailDetails from './apps/mail/cmps/MailDetails.js'

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
			children: [
				{
					path: '',
					component: MailList
				},
				{
					path: ':mailId',
					component: MailDetails
				}
			]
		},
		{
			path: '/keep',
			component: Keep,
			children: [
				{
					path: ':noteId',
					component: NoteDetails
				}]
		},
	],
}

export const router = createRouter(routerOptions)
