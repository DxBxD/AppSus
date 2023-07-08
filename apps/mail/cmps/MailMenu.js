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
          <li @click="onSelectFilter('label-work')" :class="{ 'curr-filter': currFilter === 'label-work' || immediateCurrFilter === 'label-work' }"><span class="material-icons work-label">label</span> Work</li>
          <li @click="onSelectFilter('label-personal')" :class="{ 'curr-filter': currFilter === 'label-personal' || immediateCurrFilter === 'label-personal' }"><span class="material-icons personal-label">label</span> Personal</li>
          <li @click="onSelectFilter('label-friends')" :class="{ 'curr-filter': currFilter === 'label-friends' || immediateCurrFilter === 'label-friends' }"><span class="material-icons friends-label">label</span> Friends</li>
          <li @click="onSelectFilter('label-important')" :class="{ 'curr-filter': currFilter === 'label-important' || immediateCurrFilter === 'label-important' }"><span class="material-icons important-label">label</span> Important</li>
          <li @click="onSelectFilter('label-spam')" :class="{ 'curr-filter': currFilter === 'label-spam' || immediateCurrFilter === 'label-spam' }"><span class="material-icons spam-label">label</span> Spam</li>
        </ul>
      </aside>
    `,
    methods: {
            onSelectFilter(filter) {
              this.$emit('filter', filter)
              this.$router.push('/mail')
              this.immediateCurrFilter = filter
            },
    },
    data() {
        return {
            immediateCurrFilter: '',
        }
    }
}