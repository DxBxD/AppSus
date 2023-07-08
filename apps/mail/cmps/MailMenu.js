export default {
    props: ['unreadCounts', 'currFilter'],
    template: `
        <aside class="mail-menu">
        <ul>
            <li @click="onSelectFilter('inbox')" :class="{ 'unread-exists': unreadCounts.inbox, 'curr-filter': currFilter === 'inbox' || immediateCurrFilter === 'inbox' }"><span class="material-icons-outlined">inbox</span> Inbox <span class="unread-count" v-if="unreadCounts.inbox">{{ unreadCounts.inbox }}</span></li>
            <li @click="onSelectFilter('starred')" :class="{ 'unread-exists': unreadCounts.starred, 'curr-filter': currFilter === 'starred' || immediateCurrFilter === 'starred' }"><span class="material-icons-outlined">star_border</span> Starred <span class="unread-count" v-if="unreadCounts.starred">{{ unreadCounts.starred }}</span></li>
            <li @click="onSelectFilter('sent')" :class="{ 'unread-exists': unreadCounts.sent, 'curr-filter': currFilter === 'sent' || immediateCurrFilter === 'sent'}"><span class="material-icons-outlined">send</span> Sent <span class="unread-count" v-if="unreadCounts.sent">{{ unreadCounts.sent }}</span></li>
            <li @click="onSelectFilter('draft')" :class="{ 'unread-exists': unreadCounts.draft, 'curr-filter': currFilter === 'draft' || immediateCurrFilter === 'draft' }"><span class="material-icons-outlined">insert_drive_file</span> Draft <span class="unread-count" v-if="unreadCounts.draft">{{ unreadCounts.draft }}</span></li>
            <li @click="onSelectFilter('trash')" :class="{ 'curr-filter': currFilter === 'trash' || immediateCurrFilter === 'trash' }"><span class="material-icons-outlined">delete</span> Trash</li>
            <li @click="onSelectFilter('archived')" :class="{ 'curr-filter': currFilter === 'archived' || immediateCurrFilter === 'archived'}"><span class="material-icons-outlined">archive</span> Archive</li>
        </ul>
        </aside>
    `,
    methods: {
        onSelectFilter(filter) {
            this.$emit('filter', filter)
            this.$router.push('/mail')
            this.immediateCurrFilter = filter
        }
    },
    data() {
        return {
            immediateCurrFilter: ''
        }
    }
}