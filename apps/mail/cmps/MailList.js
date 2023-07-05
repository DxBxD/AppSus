// import { mailService } from '../../../services/mail.service.js'

export default {
    template: `
    <div class="mail-list">
        <div v-for="mail in mails" :key="mail.id">
            <h3>mail.subject</h3>
            <p>mail.body</p>
            <p> sent at </p>
        </div>
    </div>
    `,
    data() {
        return {
            mails: []
        }
    },
    created() {
        
    }
}