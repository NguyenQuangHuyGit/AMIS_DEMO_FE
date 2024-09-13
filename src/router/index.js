import { createRouter, createWebHistory } from "vue-router";
import TheGeneral from "../views/general/TheGeneral.vue";
import TheCustomer from "../views/customer/TheCustomer.vue";
import TheEmployee from "../views/employee/TheEmployee.vue";
import TheLogin from "../views/login/TheLogin.vue";
import TheImport from "../views/import/TheImport.vue";
import TheImport1 from "../views/import/importstep/ImportStep1.vue";
import TheImport2 from "../views/import/importstep/ImportStep2.vue";
import TheImport3 from "../views/import/importstep/ImportStep3.vue";
// import SystemError from "@/views/error/TheSystemError.vue";
// import NotFound from "@/views/error/TheNotFound.vue";
import TheContainer from "@/views/container/TheContainer.vue";
import NProgress from "nprogress";
import store from "../store/store.js";
import AccountService from "@/service/account.js";

const router = createRouter({
    history: createWebHistory(),
    mode: "history",
    routes: [
        {
            path: "/",
            name: "container-view",
            components: {
                public: TheContainer,
            },
            redirect: () => "/general",
            beforeEnter: async () => {
                try {
                    NProgress.start();
                    const user = await AccountService.getCurrentUser();
                    NProgress.done();
                    window.localStorage.setItem("user", user);
                } catch (error) {
                    NProgress.done();
                    handleApiResponseBeforeRoute(error);
                }
            },
            children: [
                {
                    path: "/general",
                    name: "general",
                    alias: "/",
                    components: {
                        protected: TheGeneral,
                    },
                },
                {
                    path: "/customer",
                    name: "customer",
                    components: {
                        protected: TheCustomer,
                    },
                },
                {
                    path: "/employee",
                    name: "employee",
                    components: {
                        protected: TheEmployee,
                    },
                    props: (to) => ({
                        pageSize: parseInt(to.query.pageSize) || 10,
                        pageNumber: parseInt(to.query.pageNumber) || 1,
                        fillterString: to.query.fillterString || "",
                    }),
                },
                {
                    path: "/setting",
                    name: "setting",
                    components: {
                        protected: TheGeneral,
                    },
                },
                {
                    path: "/import/:step",
                    name: "import",
                    components: {
                        protected: TheImport,
                    },
                    props: (to) => ({ step: to.params.step || 1 }),
                    children: [
                        {
                            path: "",
                            name: "import-step1",
                            component: TheImport1,
                        },
                        {
                            path: "",
                            name: "import-step2",
                            component: TheImport2,
                        },
                        {
                            path: "",
                            name: "import-step3",
                            component: TheImport3,
                        },
                    ],
                },
            ],
        },
        {
            path: "/login",
            name: "login",
            components: {
                public: TheLogin,
            },
            alias: "/login",
            beforeEnter: async () => {
                try {
                    if (store.getters.getAuthState) {
                        NProgress.start();
                        const user = await AccountService.getCurrentUser();
                        NProgress.done();
                        window.localStorage.setItem("user", user);
                        return { name: "employee" };
                    }
                } catch (error) {
                    NProgress.done();
                    handleApiResponseBeforeRoute(error);
                }
            },
        },
        {
            path: "/:catchAll(.*)",
            name: "not-found",
            components: {
                public: () => import("@/views/error/TheNotFound.vue"),
            },
        },
        {
            path: "/",
            name: "server-error",
            components: {
                public: () => import("@/views/error/TheSystemError.vue"),
            },
        },
    ],
});

function handleApiResponseBeforeRoute(error) {
    if (!error || !error.response || !error.response.status) {
        return router.push({ name: "server-error" });
    } else {
        const status = error.response.status;
        switch (status) {
            case 419:
                store.commit("changeLoginState", false);
                return router.replace({
                    name: "login",
                });
            default:
                return router.push({ name: "server-error" });
        }
    }
}

export default router;
