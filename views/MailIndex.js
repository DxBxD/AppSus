import { mailService } from '../services/mail.service.js'
import NavBar from '../apps/mail/cmps/NavBar.js'
import MailMenu from '../apps/mail/cmps/MailMenu.js'
import MailSort from '../apps/mail/cmps/MailSort.js'
import MailList from '../apps/mail/cmps/MailList.js'
import MailCompose from '../apps/mail/cmps/MailCompose.js'

export default {
    template: `
        <section class="mail-page">
            <div class="mail-logo" @click="onFilter('inbox')"><RouterLink to="/mail">MisterEmail</RouterLink></div>
            <div class="mail-compose"><MailCompose/></div>
            <NavBar @search="onSearch"/>
            <MailMenu @filter="onFilter"/>
            <MailSort @sort="onSort"/>
            <RouterView :mails="mails" @starred="onMailStarred"/>
        </section>
    `,
    components: {
        NavBar,
        MailCompose,
        MailMenu,
        MailSort,
        MailList,
    },
    data() {
        return {
            mails: []
        }
    },
    created() {
        this.fetchMails()
    },
    methods: {
        onSearch(searchText) {
            mailService.setFilterBy({txt: searchText})
            this.fetchMails()
        },
        onFilter(filter) {
            mailService.setFilterBy({status: filter})
            this.fetchMails()
        },
        onSort(type) {
            // Currently not implemented
            // mailService.setSortBy(type)
            // this.fetchMails()
        },
        fetchMails() {
            mailService.query()
                .then(mails => {
                    console.log('Fetched mails:', mails)
                    this.mails = mails
                })
        },
        onMailStarred(starredMail) {
            mailService.save(starredMail).then(this.fetchMails)
        }
    }
}