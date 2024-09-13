import { createStore } from "vuex";

const store = createStore({
    state() {
        return {
            user: {},
            isAuth: true,
            selectedEmployee: new Set(),
        };
    },
    mutations: {
        changeLoginState(state, newValue) {
            state.isAuth = newValue;
        },

        updateSeletedEmployeeSet(state, newValue) {
            state.selectedEmployee = newValue;
        },
    },
    getters: {
        getAuthState(state) {
            return state.isAuth;
        },

        getSelectedEmployee(state) {
            return state.selectedEmployee;
        },
    },
});

export default store;
