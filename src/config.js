export const BACKEND_URL = "http://localhost:8000";

export const loginRoute = BACKEND_URL + "/auth/login_google";

export const LOCAL_STORAGE_KEYS = {
  emails_criteria: "eV$#aa321|ZY%$",
  active_ds: "g3498hvds23",
  sidebar_open: "ss_open_F$#F@#@#",
  token: "dsAfh43832905%%%&@F@#@#",
  last_code: "FDSAKF$(222555@@KASDKCGB54",
  meta_mails: "fdsa3!@f@@&8bfb33##878g21"
};

export const remove_user_storage = () => {
  // This function is triggered on logout
  localStorage.removeItem(LOCAL_STORAGE_KEYS.emails_criteria);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.active_ds);

}