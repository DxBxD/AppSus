export default {
	template: `
        <header class="app-header">
        <router-link to="/"><h1 class="app-logo">AppSus</h1></router-link>
            <nav>
                <router-link to="/">Home</router-link> | 
                <router-link to="/about">About</router-link> |
                <router-link to="/mail">Mail</router-link> |
                <router-link to="/keep">Keep</router-link>
            </nav>
        </header>
    `,
}
