export default {
	template: `
        <nav class="mail-nav-bar">
        <button class="compose-button">Compose</button>
        <input v-model="searchText" @input="onSearch" type="text" placeholder="Search">
    </nav>
    `,
    data() {
        return {
            searchText: ''
        }
    },
    methods: {
        onSearch() {
            this.$emit('search', this.searchText)
        }
    }
}