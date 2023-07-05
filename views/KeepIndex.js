import NoteList from "../apps/keep/cmps/NoteList.js"
import { noteService } from "../services/note.service.js"

export default {
    template: `
        <section class="keep-index">
            <NoteList 
                v-if="notes"
                :notes="notes"/>
        </section>
    `,
    data() {
        return {
            notes: [],
        }
    },
    created() {
        noteService.query()
            .then(notes => this.notes = notes)
    },
        components: {
        NoteList,
    }
}