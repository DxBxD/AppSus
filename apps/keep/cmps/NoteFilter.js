export default {
    template: `
        <section class="note-filter-container">
            <button class="dropdown-btn" @click="showFilters"><span class="material-icons-outlined">view_list</span></button>
                <div :class="{ show: isClicked }" class="filter-categories-container">
                <span class="material-icons-outlined">arrow_drop_down</span>
                <input type="text" v-model="filterBy" @input="emitFilter" placeholder="Filter notes">
                    <a href="#/keep" @click="getAllNotes">All</a> 
                    <a href="#/keep" @click="getTextNotes">Text</a>
                    <a href="#/keep" @click="getAllImages">Images</a>
                    <a href="#/keep" @click="getAllVideos">Videos</a>
                </div>
            </section>`,
    data() {
        return {
            filterBy: null,
            isClicked: false
        }
    },
    methods: {
        showFilters() {
            this.isClicked = !this.isClicked
        },
        emitFilter() {
            this.$emit('set-filter', this.filterBy)
        },
        getAllNotes() {
            this.filterBy = 'all'
            this.emitFilter()
            this.isClicked = !this.isClicked
        },
        getTextNotes() {
            this.filterBy = 'text'
            this.emitFilter()
            this.isClicked = !this.isClicked
        },
        getAllImages() {
            this.filterBy = 'image'
            this.emitFilter()
            this.isClicked = !this.isClicked
        },
        getAllVideos() {
            this.filterBy = 'video'
            this.emitFilter()
            this.isClicked = !this.isClicked
        }
    }
}
