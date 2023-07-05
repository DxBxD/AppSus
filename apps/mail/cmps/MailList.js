import { mailService } from '../../../services/mail.service.js'
import MailPreview from './MailPreview.js'

export default {
    template: `
    <section class="mail-list">
        <MailPreview v-for="mail in mails" :key="mail.id" :mail="mail" @clicked="onMailClick" />
    </section>
    `,
    components: {
        MailPreview
    },
    data() {
        return {
            mails: []
        }
    },
    created() {
        mailService.query()
            .then(mails => {
                this.mails = mails
            })
    },
    methods: {
        onMailClick(selectedMail) {
            ///////////////////////
        }
    }
}