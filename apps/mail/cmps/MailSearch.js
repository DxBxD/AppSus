export default {
	template: `
        <nav class="mail-search-bar">
            <input v-model="searchText" @input="onSearch" type="text" placeholder="Search mail">
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
            this.$router.push('/mail')
        }
    }
}