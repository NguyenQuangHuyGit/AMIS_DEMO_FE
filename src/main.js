import { createApp } from "vue";
import clickOutside from "./js/directive/clickoutside.js";
import clickOutsideVer2 from "./js/directive/clickoutside-ver2.js";
import hoverIndex from "./js/directive/hoverindex.js";
import MButton from "@/components/base/button/MButton.vue";
import MTextfield from "@/components/base/textfield/MTextfield.vue";
import MTable from "@/components/base/table/MTable.vue";
import MDropdownList from "@/components/base/dropdownlist/MDropdownList.vue";
import MCombobox from "@/components/base/combobox/MCombobox.vue";
import Loading from "@/components/base/loading/MLoading.vue";
import MDialog from "@/components/base/dialog/MDialog.vue";
import MToastContainer from "@/components/base/toastmessage/MToastContainer.vue";
import MDatePicker from "@/components/base/datepicker/MDatePicker.vue";
import MRadioGroup from "@/components/base/radiogroup/MRadioGroup.vue";
import MContextMenu from "@/components/base/contextmenu/MContextMenu.vue";
import MForm from "@/components/base/form/MForm.vue";
import router from "./router/index.js";
import formatValue from "./js/helper/format.js";
import validateTools from "./js/helper/validate.js";
import validateVer2 from "./js/helper/validate-ver2.js";
import Enum from "./js/enum/enum.js";
import tinyEmitter from "tiny-emitter/instance";
import initLanguageResource from "./js/helper/convertlang.js";
import Common from "./js/helper/common.js";
import store from "./store/store.js";
import App from "./App.vue";
import { Tooltip } from "ant-design-vue";
import "nprogress/nprogress.css";

const app = createApp(App);

app.use(store);

// Khai báo custom directive ClickOutSide
app.directive("clickOutside", clickOutside);
app.directive("clickOutsideVer2", clickOutsideVer2);
app.directive("hoverIndex", hoverIndex);

// Khai bóa các component sử dụng trong App
app.component("MButton", MButton)
    .component("Tooltip", Tooltip)
    .component("MTable", MTable)
    .component("MDropdownList", MDropdownList)
    .component("MDialog", MDialog)
    .component("MCombobox", MCombobox)
    .component("MTextfield", MTextfield)
    .component("Loading", Loading)
    .component("MDatePicker", MDatePicker)
    .component("MRadioGroup", MRadioGroup)
    .component("MForm", MForm)
    .component("MContextMenu", MContextMenu)
    .component("MToastContainer", MToastContainer);

// Khai báo các global properties dùng trong toàn App
app.config.globalProperties.formatValue = formatValue;
app.config.globalProperties.common = Common;
app.config.globalProperties.validateTools = validateTools;
app.config.globalProperties.validateVer2 = validateVer2;
app.config.globalProperties.Enum = Enum;
app.config.globalProperties.emitter = tinyEmitter;

// Khai báo Resource ban đầu cho App
initLanguageResource(app);

// Khai báo router định tuyến
app.use(router);

// Mount vào DOM
app.mount("#app");

export default app;
