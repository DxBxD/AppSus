export default {
    template: `
        <div class="mail-sort">
            <button @click="onSort('date')"><i class="fa fa-calendar"></i> Date</button>
            <button @click="onSort('subject')"><i class="fa fa-book"></i> Subject</button>
        </div>
    `,
    methods: {
        onSort(type) {
            this.$emit('sort', type)
        }
    }
}