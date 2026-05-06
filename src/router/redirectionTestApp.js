import {testConfigPage} from "../../../pages/testConfig/testConfig.js";
import {homePage} from "../../../pages/homeTestApp/homeTestApp.js";
import {page401} from "../../pages/page401/page401.js"; 
 export  function getPageForTestApp(route,params) {
  let html;
  switch (route) {
    case "/test-config":
      html = testConfigPage();
      break;
    case "/home":
      html = homePage();
      break;
    case "/page-401":
      html = page401();
      break;
    default:
      html = homePage();
      break;
  }

  return html;
}
