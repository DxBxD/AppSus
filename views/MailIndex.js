import { mailService } from '../services/mail.service.js'
import { noteService } from '../services/note.service.js'
import MailSearch from '../apps/mail/cmps/MailSearch.js'
import MailMenu from '../apps/mail/cmps/MailMenu.js'
import MailSort from '../apps/mail/cmps/MailSort.js'
import MailList from '../apps/mail/cmps/MailList.js'
import MailCompose from '../apps/mail/cmps/MailCompose.js'
import MailLabelModal from '../apps/mail/cmps/MailLabelModal.js'

export default {
    template: `
        <section class="mail-page">
            <div class="mail-logo" @click="onFilter('inbox')"><RouterLink to="/mail">MisterEmail</RouterLink></div>
            <div class="mail-compose"><MailCompose @send="onSendMail"/></div>
            <MailSearch @search="onSearch"/>
            <MailMenu :curr-filter="currFilter" :unread-counts="unreadCounts" @filter="onFilter"/>
            <MailSort @sort="onSort"/>
            <RouterView :mails="mails" 
                        @opened="onMailOpened" 
                        @starred="onMailStarred"
                        @deleted="onMailDeleted"
                        @toggleRead="onMailToggleRead"
                        @toggleArchive="onMailToggleArchive"
                        @openLabelModal="onOpenLabelModal"
                        @saveAsNote="onMailSavedAsNote"/>
            <MailLabelModal v-if="labelModalShown" :mail="currMail" @selected-labels="onSelectedLabels" @close="onCloseLabelModal" />
        </section>
    `,
    components: {
        MailSearch,
        MailCompose,
        MailMenu,
        MailSort,
        MailList,
        MailLabelModal
    },
    data() {
        return {
            mails: [],
            unreadCounts: {},
            currFilter: 'inbox',
            showComposeForm: false,
            labelModalShown: false,
            currMail: null,
            selectedLabels: []
        }
    },
    created() {
        this.fetchMails()
        this.fetchUnreadCounts()
        this.fetchCurrFilter()
    },
    methods: {
        fetchUnreadCounts() {
            mailService.getUnreadCounts()
                .then(unreadCounts => {
                    this.unreadCounts = unreadCounts
                })
        },
        fetchCurrFilter() {
            this.currFilter = mailService.getCurrFilter()
        },
        onSearch(searchText) {
            mailService.setFilterBy({ txt: searchText })
            this.fetchMails()
        },
        onFilter(filter) {
            mailService.setFilterBy({ status: filter })
            this.fetchMails()
        },
        onSort(sortObj) {
            mailService.setSortBy(sortObj)
            this.fetchMails()
        },
        fetchMails() {
            this.$router.push({ query: {} })
            mailService.query()
                .then(mails => {
                    this.mails = mails
                })
                .then(this.fetchUnreadCounts)
                .then(this.fetchCurrFilter)
        },
        onMailStarred(starredMail) {
            mailService.save(starredMail).then(this.fetchMails)
        },
        onMailOpened(openedMail) {
            mailService.save(openedMail).then(this.fetchMails)
        },
        onMailDeleted(deletedMail) {
            if (deletedMail.removedAt) {
                mailService.remove(deletedMail.id).then(this.fetchMails)
            } else {
                deletedMail.removedAt = Date.now()
                mailService.save(deletedMail).then(this.fetchMails)
            }
            this.$router.push('/mail')
        },
        onMailToggleRead(toggledMail) {
            toggledMail.isRead = !toggledMail.isRead
            mailService.save(toggledMail).then(this.fetchMails)
        },
        onMailToggleArchive(toggledMail) {
            toggledMail.isArchived = !toggledMail.isArchived
            mailService.save(toggledMail).then(this.fetchMails)
            this.$router.push('/mail')
        },
        onMailSavedAsNote(notedMail) {
            noteService.saveMailAsNote(notedMail.subject, notedMail.body)
        },
        onSendMail(mail) {
            mailService.save(mail).then(() => {
                this.fetchMails()
                this.fetchUnreadCounts()
                this.$router.push('/mail')
            })
        },
        onOpenLabelModal(mail) {
            this.currMail = mail
            this.labelModalShown = true
        },
        onCloseLabelModal() {
            this.labelModalShown = false
            this.currMail = null
        },
        onSelectedLabels(labels) {
            this.selectedLabels = labels
            if (this.currMail) {
                const updatedMail = { ...this.currMail, labels: [...labels] }
                mailService.save(updatedMail).then(() => {
                    this.fetchMails()
                    this.fetchUnreadCounts()
                    console.log(updatedMail)
                })
            }
        },
    },
    watch: {
        '$route': {
            handler: 'fetchMails',
            immediate: true
        },
    }
}