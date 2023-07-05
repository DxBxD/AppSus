export default {
    template: `
            <section class="mail-sort">
                <div>
                    <button @click="onSort('date')"><span class="material-icons">event</span> Date <span class="material-icons">arrow_drop_down</span></button>
                    <button @click="onSort('subject')"><span class="material-icons">subject</span> Subject <span class="material-icons">arrow_drop_down</span></button>
                </div>
            </section>
`,
    methods: {
        onSort(type) {
            this.$emit('sort', type)
        }
    }
}