import $$ from "cmn-utils";
import axios from "axios";

import config from '@/config';
import routerLinks from "@/utils/routerLinks";
import { refresh_AUTH } from '@/routes/Auth/Login/service';
let checkAuth;

export default (history, check) => {
  const user = $$.getStore(config.store.user);
  if (check || (!!user && !user.expires_in)) clearInterval(checkAuth)
  else  {
    const time = new Date().getTime();
    if (!user || time >= user.expires_in) {
      history.push(routerLinks("Login"))
    } else {
      axios.defaults.headers.common['Authorization'] = user.token;
      checkAuth =  setInterval(async () => {
        if (user.remember) {
          const { data } = await refresh_AUTH();
          axios.defaults.headers.common['Authorization'] = data.token;
          data.remember = user.remember
          $$.setStore(config.store.user, data);
        } else {
          setTimeout(() => {
            history.push(routerLinks("Login"))
            clearInterval(checkAuth);
          }, 50000)
        }
      }, user.expires_in - time - 50000)
    }
  }
}
