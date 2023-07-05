import { mailService } from '../../../services/mail.service.js'
import MailPreview from './MailPreview.js'

export default {
    props: ['mails'],
    template: `
        <section class="mail-list">
            <MailPreview v-for="mail in mails" :key="mail.id" :mail="mail" @clicked="onMailClick" />
        </section>
    `,
    components: {
        MailPreview
    },
    methods: {
        onMailClick(selectedMail) {
            ///////////////////////
        }
    }
}