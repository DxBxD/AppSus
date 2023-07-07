export default {
    template: `
            <section class="mail-sort">
                <div>
                    <button @click="onSort('sentAt')">
                        <span class="material-icons-outlined">event</span> Date 
                        <span class="material-icons-outlined">{{ dateSortDown ? 'expand_more' : 'expand_less' }}</span>
                    </button>
                    <button @click="onSort('subject')">
                        <span class="material-icons-outlined">subject</span> Subject 
                        <span class="material-icons-outlined">{{ subjectSortDown ? 'expand_more' : 'expand_less' }}</span>
                    </button>
                </div>
            </section>
    `,
    data() {
        return {
            dateSortDown: true,
            subjectSortDown: true
        }
    },
    methods: {
        onSort(type) {
            const order = type === 'sentAt' ? !this.dateSortDown : !this.subjectSortDown
            this.$emit('sort', { type, order })
            type === 'sentAt' ? this.dateSortDown = !this.dateSortDown : this.subjectSortDown = !this.subjectSortDown
        }
    },
}