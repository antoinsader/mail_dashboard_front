import { useState } from "react";
import ErrorComp from "../Error/Error";
import Popup from "../Popup/Popup";
import "./EmailsList.scss";
import DataTable from "../DataTable/DataTable";
import { FiRefreshCcw, FiSave } from "react-icons/fi";
import { postRequest } from "../../api/requests";
import EmailHtmlDisplay from "../EmailHtmlDisplay/EmailHtmlDisplay";

export default function EmailsList({
  loading,
  error,
  emails,
  title,
  subtitle,
  refreshMails,
  hideSaveBtn
}) {
  const [selected_popup_email, set_selected_popup_email] = useState(null);
  const [save_popup_visible, set_save_popup_visible] = useState(false);

  if (error) return <ErrorComp error={error} />;
  if (emails && emails.length === 0)
    return <p style={{ margin: "1rem" }}>No emails was retreived!</p>;

  const SaveDatasetPopup = () => (
    <Popup
      title="Save table data as dataset"
      isVisible={save_popup_visible}
      closePopup={() => set_save_popup_visible(false)}
    >
      <div className="save_as_dataset_popup_root">
        <h3 className="title"> Save as dataset </h3>
        <p className="subtitle">
          {" "}
          This will be saved in the server and be visible to everyone, if you
          don't want you can save the criteria only and fetch it after{" "}
        </p>
        {refreshMails ? (
          <button className="primary" onClick={() => refreshMails(true)}>
            Save as dataset
          </button>
        ) : (
          ""
        )}
      </div>
    </Popup>
  );

  const EmailDetailsPopup = () => (
    <Popup
      title="Email details"
      isVisible={selected_popup_email}
      closePopup={() => set_selected_popup_email(null)}
    >
      {selected_popup_email ? (
        <div className="popup_email_details_root">
          <div className="email_field">
            <span className="field_label">Message ID:</span>
            <span className="field_value">
              {selected_popup_email.message_id}
            </span>
          </div>

          <div className="email_field">
            <span className="field_label">Subject:</span>
            <span className="field_value">{selected_popup_email.subject}</span>
          </div>

          <div className="email_field">
            <span className="field_label">Sender:</span>
            <span className="field_value">
              {selected_popup_email.sender_name}
            </span>
          </div>

          <div className="email_field">
            <span className="field_label">Sender Email:</span>
            <span className="field_value">
              {selected_popup_email.sender_mail}
            </span>
          </div>

          <div className="email_field email_content">
            <span className="field_label">Content:</span>
            <EmailHtmlDisplay 
              html={selected_popup_email.content_html}
            />

          </div>
        </div>
      ) : (
        ""
      )}
    </Popup>
  );

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
  const customBtns = [
    {
      key: "refresh",
      label: "Refresh",
      icon: <FiRefreshCcw />,
      onClick: () => refreshMails(),
      class: "secondary",
      hide: !refreshMails,
    },
    {
      key: "save_as_dataset",
      label: "Save as dataset",
      icon: <FiSave />,
      onClick: () => set_save_popup_visible(true),
      class: "secondary",
      hide: hideSaveBtn
    },
  ];

  return (
    <div className="emails_list_container_root">
      <DataTable
        columns={columns}
        data={emails}
        loading={loading}
        row_click={(row) => set_selected_popup_email(row)}
        title={title}
        subtitle={subtitle}
        customBtns={customBtns}
      />
      <EmailDetailsPopup />
      <SaveDatasetPopup />
    </div>
  );
}
