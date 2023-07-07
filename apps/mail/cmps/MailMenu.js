export default {
    template: `
        <aside class="mail-menu">
            <ul>
                <li @click="onSelectFilter('inbox')"><span class="material-icons-outlined">inbox</span> Inbox</li>
                <li @click="onSelectFilter('starred')"><span class="material-icons-outlined">star_border</span> Starred</li>
                <li @click="onSelectFilter('sent')"><span class="material-icons-outlined">send</span> Sent</li>
                <li @click="onSelectFilter('draft')"><span class="material-icons-outlined">insert_drive_file</span> Draft</li>
                <li @click="onSelectFilter('trash')"><span class="material-icons-outlined">delete</span> Trash</li>
                <li @click="onSelectFilter('archived')"><span class="material-icons-outlined">archive</span> Archive</li>
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