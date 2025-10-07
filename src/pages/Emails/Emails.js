import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { postRequest } from "../../api/requests";
import Section from "../../components/Section/Section";
import AutocompleteInput from "../../components/Inputs/AutoComplete";
import TextInput from "../../components/Inputs/TextInput";
import DatePicker from "../../components/Inputs/DatePicker";
import Button from "../../components/Button/Button";

import "./Emails.scss";
import { useCache, useCachedState } from "../../context/CacheContext";
import { LOCAL_STORAGE_KEYS } from "../../config";
import { FiSave } from "react-icons/fi";
import DataTable from "../../components/DataTable/DataTable";
import Popup from "../../components/Popup/Popup";
import EmailHtmlDisplay from "../../components/EmailHtmlDisplay/EmailHtmlDisplay";
import { useNavigate } from "react-router-dom";

export default function Emails() {
  const { getCache, setCache } = useCache();

  const [sender, set_sender] = useState("");
  const [subject, set_subject] = useState("");
  const [date_from, set_date_from] = useState();
  const [date_to, set_date_to] = useState();
  const [only_unseen, set_only_unseen] = useState(false);

  const [all_senders, set_all_senders] = useState([]);
  const [all_subjects, set_all_subjects] = useState([]);
  const [min_date, set_min_date] = useState(null);
  const [max_date, set_max_date] = useState(null);

  const [loading_mails, set_loading_mails] = useState(false);
  const [loading_meta, set_loading_meta] = useState(false);

  const [mails_data, set_mails_data] = useState([]);

  const [save_popup_visible, set_save_popup_visible] = useState(false);
  const [save_loading, set_save_loading] = useState(false);
  const [selected_email_popup, set_selected_email_popup] = useState(null);
  const [saved_dataset, set_saved_dataset] = useState();

  const navigate = useNavigate();

  const setActiveAndGoDatasets = () => {
    setCache(LOCAL_STORAGE_KEYS.active_ds, saved_dataset.ds_id);
    navigate("/dataset");
  };

  useEffect(() => {
    async function get_meta_data() {
      set_loading_meta(true);

      const [cached_meta_data, cached_date] = getCache(
        LOCAL_STORAGE_KEYS.meta_mails
      );
      const now = new Date();
      console.log("cached date: ", new Date(cached_date));
      const cache_valid =
        cached_meta_data &&
        cached_date &&
        (now - new Date(cached_date)) / (1000 * 60 * 60) < 5;
      console.log("cache valid : ", cache_valid);
      let meta;
      if (cache_valid) {
        meta = cached_meta_data;
        set_loading_meta(false);
      } else {
        try {
          meta = await postRequest({ route: "gmail/get_meta" });
          setCache(LOCAL_STORAGE_KEYS.meta_mails, meta);
        } catch (ex) {
          toast.error("Error fetching meta of emails");
          console.error("Error fetching meta: ", ex);
        } finally {
          set_loading_meta(false);
        }
      }

      if (meta) {
        const senders = [
          ...(meta.senders_emails || []),
          ...(meta.senders_emails || []),
        ];
        set_all_senders(senders);

        set_all_subjects(meta.subjects || []);

        set_min_date(meta.min_date ? new Date(meta.min_date) : null);
        set_max_date(meta.max_date ? new Date(meta.max_date) : null);
      }
    }
    get_meta_data();
  }, []);

  const get_emails = async () => {
    set_loading_mails(true);

    console.log("datE_from : ", date_from);

    const criteria = {
      sender: sender || null,
      subject: subject || null,
      date_from: date_from ? date_from.toISOString().split("T")[0] : null,
      date_to: date_to ? date_to.toISOString().split("T")[0] : null,
      only_unseen: only_unseen,
    };

    try {
      const mails = await postRequest({
        route: "gmail/get_ds_mails",
        body: {
          criteria,
        },
      });
      set_mails_data(mails);
    } catch (ex) {
      toast.error("Error getting mails");
      console.error("Error getting mails: ", ex);
    } finally {
      set_loading_mails(false);
    }
  };

  const save_dataset = async (save_name) => {
    try {
      set_save_loading(true);
      const save_req = await postRequest({
        route: "gmail/save",
        body: {
          save_name: save_name,
        },
      });
      if (save_req && save_req.message) {
        toast.success(
          "Dataset saved successfully, you can access it after with your code"
        );
        set_saved_dataset({ name: save_name, ds_id: save_req.ds_id });
        set_save_popup_visible(false);
      }
    } catch (ex) {
      toast.error("Error saving dataset, NOT SAVED");
      console.error("Error saving dataset: ", ex);
    } finally {
      set_save_loading(false);
    }
  };

  const Filters = () => {
    return (
      <div className="filters_card">
        <div className="filters_title"> Emails filter </div>
        <p className="subtitle">
          Select filters of the emails list you want to get then press on get
          emails
        </p>
        <div className="filter_row">
          <AutocompleteInput
            label="Sender"
            options={all_senders}
            value={sender}
            onChange={set_sender}
            width={"300px"}
          />
          <AutocompleteInput
            label="Subject"
            options={all_subjects}
            value={subject}
            onChange={set_subject}
            width={"300px"}
          />
        </div>
        <div className="filter_row">
          <DatePicker
            label="From"
            value={date_from}
            onChange={set_date_from}
            min={min_date}
            max={max_date}
            width={"300px"}
          />
          <DatePicker
            label="To"
            value={date_to}
            onChange={set_date_to}
            min={date_from}
            max={max_date}
            width={"300px"}
          />
        </div>

        <div className="filters_footer">
          <div className="checkbox_wrapper">
            <input
              type="checkbox"
              id="only_unseen"
              checked={only_unseen}
              onChange={() => set_only_unseen(!only_unseen)}
            />
            <label htmlFor="only_unseen">Only Unseen Emails</label>
          </div>
          <Button loading={loading_mails || loading_meta} onClick={get_emails}>
            Get emails
          </Button>
        </div>
      </div>
    );
  };

  const SaveDatasetPopup = () => {
    const [save_name, set_save_name] = useState("");

    return (
      <Popup
        title="Save table data as dataset"
        isVisible={save_popup_visible}
        closePopup={() => set_save_popup_visible(false)}
      >
        <div className="save_as_dataset_popup_root">
          <h3 className="title"> Save as dataset </h3>
          <p className="subtitle">
            This emails list will be saved in the server, and you can access it
            only you through your private code
          </p>
          <p> Please choose name for the dataset</p>

          <TextInput
            label="Save dataset as"
            value={save_name}
            onChange={set_save_name}
            required={true}
          />
          <Button
            disabled={save_name === "" || save_loading}
            onClick={() => save_dataset(save_name)}
            loading={save_loading}
          >
            Save
          </Button>
        </div>
      </Popup>
    );
  };

  const EmailDetailsPopup = () => (
    <Popup
      title="Email details"
      isVisible={selected_email_popup}
      closePopup={() => set_selected_email_popup(null)}
    >
      {selected_email_popup ? (
        <div className="popup_email_details_root">
          <div className="email_field">
            <span className="field_label">Message ID:</span>
            <span className="field_value">
              {selected_email_popup.message_id}
            </span>
          </div>

          <div className="email_field">
            <span className="field_label">Subject:</span>
            <span className="field_value">{selected_email_popup.subject}</span>
          </div>

          <div className="email_field">
            <span className="field_label">Sender:</span>
            <span className="field_value">
              {selected_email_popup.sender_name}
            </span>
          </div>

          <div className="email_field">
            <span className="field_label">Sender Email:</span>
            <span className="field_value">
              {selected_email_popup.sender_mail}
            </span>
          </div>

          <div className="email_field email_content">
            <span className="field_label">Content:</span>
            <EmailHtmlDisplay html={selected_email_popup.content_html} />
          </div>
        </div>
      ) : (
        ""
      )}
    </Popup>
  );

  const Emails = () => {
    const columns = [
      { field: "subject", label: "Subject", width: "30%" },
      { field: "sender_name", label: "Sender", width: "10%" },
      { field: "sender_mail", label: "Sender email", width: "10%" },
      { field: "content_html", hide: true },
      {
        field: "content_clean",
        label: "Content",
        type: "part",
        width: "50%",
      },
    ];

    return (
      <>
        <h3 className="title"> Emails list </h3>
        <h3 className="subtitle">
          Here all are emails according to the filters you chose, if you choose
          to save, the emails would be saved in datasets and you can access them
          after with your code
        </h3>
        {mails_data && mails_data.length > 0 ? (
          saved_dataset ? (
            <div className="success_note">
              <p>
                Data was saved successully with name{" "}
                {saved_dataset && saved_dataset.name}, to access the dataset
                after use your code, and to process the dataset, set it as
                active and go to dataset page{" "}
              </p>
              <Button onClick={setActiveAndGoDatasets}>
                Set as active dataset and process it
              </Button>
            </div>
          ) : (
            <Button
              variant="secondary"
              onClick={() => set_save_popup_visible(true)}
            >
              <FiSave /> Save as dataaset
            </Button>
          )
        ) : (
          ""
        )}

        <DataTable
          columns={columns}
          data={mails_data}
          loading={loading_mails}
          row_click={(row) => set_selected_email_popup(row)}
        />
        <EmailDetailsPopup />
        <SaveDatasetPopup />
      </>
    );
  };

  return (
    <div className="emails_root">
      <Section title="Emails" section_key="emails_root_section">
        {loading_meta ? <div className="spinner"></div> : <Filters />}

        <Emails />
      </Section>
    </div>
  );
}
