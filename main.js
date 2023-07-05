const { createApp } = Vue

import { router } from './routes.js'

import AppHeader from './cmps/AppHeader.js'
import AppFooter from './cmps/AppFooter.js'
import UserMsg from './cmps/UserMsg.js'

const options = {
	template: `
        <section>
            <AppHeader />
            <RouterView />
            <AppFooter />
            <UserMsg />
        </section>
    `,
	components: {
		AppHeader,
		AppFooter,
		UserMsg,
	},
}

const app = createApp(options)
app.use(router)
app.mount('#app')
