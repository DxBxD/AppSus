import MenuBar from '../apps/keep/cmps/MenuBar.js';
import MenuButtons from '../apps/keep/cmps/MenuButtons.js';
import { noteService } from "../services/note.service.js"
import NoteList from "../apps/keep/cmps/NoteList.js"

export default {
    template: `
        <section class="keep-options-bar">
            <MenuBar />
            <MenuButtons />    
        </section>
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
        MenuBar,
        MenuButtons
    }
}