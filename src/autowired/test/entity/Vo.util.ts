import { Person } from "./Person.vo";


export const VoUtil = {
    getVoId(){
        return new Date().getTime() + "";
    }
}

