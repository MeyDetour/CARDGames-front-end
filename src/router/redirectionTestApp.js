import {testConfigPage} from "../../pages/testConfig/testConfig.js";
import {homePage} from "../../pages/home/home.js";
import {page401} from "../../pages/page401/page401.js"; 
 export  function getPageForTestApp(route) {
  let html;
  switch (route) {
    case "/test-config":
      html = testConfigPage(params);
      break;
    case "/home":
      html = homePage(params);
      break;
    case "/page-401":
      html = page401(params);
      break;
    default:
      html = homePage(params);
      break;
  }

  return html;
}
