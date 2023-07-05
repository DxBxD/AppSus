const { createApp } = Vue

import { router } from './routes.js'

import AppHeader from './cmps/AppHeader.js'
import UserMsg from './cmps/UserMsg.js'

const options = {
	template: `
        <section class="main-layout">
            <AppHeader />
            <RouterView />
            <UserMsg />
        </section>
    `,
	components: {
		AppHeader,
		UserMsg,
	},
}

const app = createApp(options)
app.use(router)
app.mount('#app')
