import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { useCache, useCachedState } from "../../context/CacheContext";
import { LOCAL_STORAGE_KEYS } from "../../config";

import { FiCopy } from "react-icons/fi";

import Section from "../../components/Section/Section";
import Button from "../../components/Button/Button";
import DataTable from "../../components/DataTable/DataTable";

import "./Home.scss";
import { postRequest } from "../../api/requests";

export default function Home() {
  const [show_code, set_show_code] = useState(false);
  const [active_ds_id, set_active_ds] = useCachedState(
    LOCAL_STORAGE_KEYS.active_ds,
    null
  );
  const [datasets_data, set_datasets_data] = useState([]);
  const [datasets_loading, set_datasets_loading] = useState([]);

  const { user_app, user_google } = useAuth();
  const { setCache } = useCache();

  const get_ds = async () => {
    set_datasets_loading(true);
    try {
      const res = await postRequest({ route: "ds/get_list", body: {} });
      res.forEach((row) => {
        if (row.id == active_ds_id) {
          row.active = true;
        }
      });

      set_datasets_data(res);
    } catch (ex) {
      toast.error("Error loading ds data");
      console.error("error loading ds data: ", ex);
    } finally {
      set_datasets_loading(false);
    }
  };

  useEffect(() => {
    get_ds();
  }, []);

  const copy_code = () => {
    navigator.clipboard.writeText(user_app.code).then(() => {
      setCache(LOCAL_STORAGE_KEYS.last_code, user_app.code);
      toast.success("Code copied to clipboard");
    });
  };

  const datasets_columns = [
    { field: "id", hide: true },
    { field: "ds_name", label: "DS name" },
  ];

  return (
    <div className="home_root">
      <Section title="Your info" section_key="info_section">
        <div className="user_info_container">
          <h3 className="section_title">Your Login Code</h3>
          <p>
            Your code that you can use to login again into your reserved area
            is:
          </p>

          {show_code ? (
            <>
              <div className="new_code">
                {user_app.code.split("").map((char, idx) => (
                  <span className="new_code_char" key={idx}>
                    {char}
                  </span>
                ))}
                <span className="new_code_char copy" onClick={copy_code}>
                  <FiCopy />
                </span>
              </div>
              <Button onClick={() => set_show_code(false)}>Hide Code</Button>
            </>
          ) : (
            <Button onClick={() => set_show_code(true)}>Show Code</Button>
          )}

          {user_google && (
            <div className="google_info">
              <p>
                <b>You are logged in with Google:</b>
              </p>
              <p>
                <b>Email:</b> {user_google.email}
              </p>
              <p>
                <b>Name:</b> {user_google.name}
              </p>
              {user_google.picture && (
                <img
                  src={user_google.picture}
                  alt="Google avatar"
                  width={200}
                />
              )}
            </div>
          )}
        </div>
      </Section>

      <Section title="Your saved datasets" section_key="section_home_ds">
        <DataTable
          columns={datasets_columns}
          data={datasets_data}
          loading={datasets_loading}
          row_click={(row) => {
            set_active_ds(row.id);
            toast.success("Active dataset has been set ");
          }}
          title="Your saved dataset"
          subtitle="If the row background is green, it means that this dataset is active, to change press on other row"
        />
      </Section>
    </div>
  );
}
