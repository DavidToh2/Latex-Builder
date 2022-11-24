import { defineStore } from 'pinia'

export const searchParametersStore = defineStore('searchParameters', {
	state: () => {
        return {
            paramList: [] as Params[]
        }
    },
    actions: {
        async fetchParamList() {
            try {

            } catch(error) {
                console.log(error);
                return error;
            }
        }
    }
})

interface Params {
    option: string
    list: string[]
}