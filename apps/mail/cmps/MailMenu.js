export default {
    template: `
        <aside class="mail-menu">
            <ul>
                <li @click="onSelectFilter('inbox')"><span class="material-icons">inbox</span> Inbox</li>
                <li @click="onSelectFilter('starred')"><span class="material-icons">star_border</span> Starred</li>
                <li @click="onSelectFilter('sent')"><span class="material-icons">send</span> Sent</li>
                <li @click="onSelectFilter('draft')"><span class="material-icons">insert_drive_file</span> Draft</li>
                <li @click="onSelectFilter('trash')"><span class="material-icons">delete</span> Trash</li>
            </ul>
        </aside>
    `,
    methods: {
        onSelectFilter(filter) {
            this.$emit('filter', filter)
            this.$router.push('/mail')
        }
    }
}