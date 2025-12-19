import { Link } from "react-router-dom";

import { useCache } from "../../context/CacheContext";
import { LOCAL_STORAGE_KEYS } from "../../config";

import Section from "../../components/Section/Section";
import EmailsList from "../../components/EmailsList/EmailsList";

import "./DataSet.scss";
import { useEffect, useState } from "react";
import { postRequest } from "../../api/requests";
import toast from "react-hot-toast";
import DataTable from "../../components/DataTable/DataTable";
import Button from "../../components/Button/Button";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import EmailHtmlDisplay from "../../components/EmailHtmlDisplay/EmailHtmlDisplay";

export default function DataSet() {
  const { getCache } = useCache();
  const active_ds_id = getCache(LOCAL_STORAGE_KEYS.active_ds)[0];

  const [emails, set_emails] = useState();
  const [loading_emails, set_loading_emails] = useState(false);
  const [emails_error, set_emails_error] = useState("");

  const [ds_stats_fired, set_ds_stats_fired] = useState(false);
  const [ds_stats, set_ds_stats] = useState({});
  const [loading_ds_stats, set_loading_ds_stats] = useState(false);

  const [emails_topics_fired, set_emails_topics_fired] = useState(false);
  const [emails_topics_loading, set_emails_topics_loading] = useState(false);
  const [emails_topics, set_emails_topics] = useState({});
  const [selected_topic, set_selected_topic] = useState();

  const [tfidf_fired, set_tfidf_fired] = useState(false);
  const [tfidf_doc_idx, set_tfidf_doc_idx] = useState(0);
  const [tfidf_loading, set_tfidf_loading] = useState(false);
  const [tfidf, set_tfidf] = useState();

  const [most_common_count, set_most_common_count] = useState(50);
  const get_emails = async () => {
    if (!active_ds_id) return;

    set_loading_emails(true);

    try {
      const res = await postRequest({
        route: "ds/get_ds_mails",
        body: { ds_id: active_ds_id },
      });
      if (res) {
        set_emails(res);
      }
    } catch (ex) {
      console.error("Error loading ds: ", ex);
      toast.error("Error loading the dataset emails");
      set_emails_error("Error loading the ds emails");
    } finally {
      set_loading_emails(false);
    }
  };

  const get_senders_list = () => {
    if (!emails) return [];
    const senders = {};

    emails.forEach((ele) => {
      if (!senders[ele.sender_name]) {
        senders[ele.sender_name] = 0;
      }

      senders[ele.sender_name] += 1;
    });
    return Object.entries(senders).sort((a, b) => b[1] - a[1]);
  };

  const get_stats_fn = async () => {
    set_loading_ds_stats(true);
    set_ds_stats_fired(true);
    try {
      const res = await postRequest({
        route: "ds/get_ds_stats",
        body: { ds_id: active_ds_id, most_common_count: most_common_count },
      });
      if (res) {
        set_ds_stats(res);
      }
    } catch (ex) {
      console.error("Error loading stats: ", ex);
      toast.error("Error loading the dataset stats");
      set_ds_stats_fired(false);
    } finally {
      set_loading_ds_stats(false);
    }
  };

  const get_tfidf_fn = async (doc_idx) => {
    console.log("active_ds_id: ", active_ds_id);
    console.log("doc_idx: ", doc_idx);
    if (!active_ds_id) return;
    set_tfidf_loading(true);

    const body = { ds_id: active_ds_id, doc_idx: doc_idx ? doc_idx : 0 };

    set_tfidf_doc_idx(body.doc_idx);

    try {
      const res = await postRequest({
        route: "ds_email/get_doc_tfidf",
        body,
      });
      if (res && res.doc_id) {
        set_tfidf(res);
        set_tfidf_fired(true);
      }
    } catch (ex) {
      console.error("Error loading tfidf: ", ex);
      toast.error("Error loading the dataset tfidf");
      set_tfidf_fired(false);
    } finally {
      set_tfidf_loading(false);
    }
  };

  const get_emails_topics = async () => {
    set_emails_topics_fired(true);
    set_emails_topics_loading(true);
    try {
      const res = await postRequest({
        route: "ds/get_ds_topics",
        body: { ds_id: active_ds_id },
      });
      if (res) {
        set_emails_topics(res);
      }
    } catch (ex) {
      console.error("Error loading topics: ", ex);
      toast.error("Error loading the dataset topics");
      set_emails_topics_fired(false);
    } finally {
      set_emails_topics_loading(false);
    }
  };
  useEffect(() => {
    get_emails();
  }, []);

  //   set_loading_topics(true);

  //   get_topics();

  if (!active_ds_id)
    return (
      <div className="no_active">
        <h3>
          Please choose dataset from the grid in <Link to={"/home"}> Home</Link>
        </h3>
      </div>
    );

  const Stats = () => {
    if (loading_ds_stats) return <div className="spinner"> </div>;

    if (!ds_stats) return <></>;

    return (
      <>
        {ds_stats.languages && (
          <div className="lang_used">
            <h3> Languages used: </h3>
            <ul className="custom_ul">
              {Object.entries(ds_stats.languages).map(
                ([lang_code, count], idx) => (
                  <li key={idx}>
                    <p>
                      {lang_code}: <span> {count} emails </span>
                    </p>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
        {emails && (
          <div className="senders">
            <h3> Senders list</h3>
            <ul className="custom_ul">
              {(get_senders_list() || []).map(
                ([sender_name, sender_count], idx) => (
                  <li key={`sender_${idx}`}>
                    <p>
                      {sender_name}: <span> {sender_count} emails </span>
                    </p>
                  </li>
                )
              )}
            </ul>
          </div>
        )}

        {ds_stats.most_common && (
          <>
            <h3> Most common tokens: </h3>
            <DataTable
              columns={[
                { field: "token", label: "Token" },
                { field: "count", label: "Count" },
              ]}
              data={ds_stats.most_common}
              hide_rows_per_page={true}
            />
          </>
        )}
      </>
    );
  };

  const TFIDF = () => {
    return (
      <div className="tfidf_doc">
        <div className="document_id_header">
          <FaArrowAltCircleLeft
            className={tfidf_loading || tfidf_doc_idx === 0 ? "disabled" : ""}
            onClick={() => {
              if (!tfidf_loading && tfidf_doc_idx > 0)
                get_tfidf_fn(tfidf_doc_idx - 1);
            }}
          />

          <h3 className="title document">
            Current document id: {tfidf_loading ? "" : tfidf_doc_idx + 1}
          </h3>
          <FaArrowAltCircleRight
            className={tfidf_loading ? "disabled" : ""}
            onClick={() => {
              if (!tfidf_loading) get_tfidf_fn(tfidf_doc_idx + 1);
            }}
          />
        </div>
        <p className="subtitle">
          Currently for the tf-idf, only the english data are being processed
        </p>

        {tfidf_loading ? (
          <div className="spinner"></div>
        ) : tfidf ? (
          <>
            <p className="badge"> Language: {tfidf.language} </p>
            <p className="subtitle">
              <b>Email text: </b> {tfidf.doc_text}{" "}
            </p>

            <h2 className="title"> Top terms: </h2>
          </>
        ) : (
          ""
        )}
        <DataTable
          columns={[
            { field: "term", label: "Term" },
            { field: "tfidf_score", label: "TF-IDF score" },
          ]}
          data={tfidf.top_terms}
          hide_rows_per_page={true}
          loading={tfidf_loading}
        />
        {!tfidf_loading && (
          <>
            <h3>All tokens: </h3>
            <div className="tokens">
              <ul className="custom_ul">
                {tfidf.tokens.map((tok, idx) => (
                  <li className="tok_span" key={`tk_${idx}`}>
                    <span>{tok} </span>
                  </li>
                ))}
              </ul>
            </div>
            <h3>Email html content: </h3>
            <EmailHtmlDisplay html={tfidf.html} />
          </>
        )}
      </div>
    );
  };

  const Topics = () => {
    if (emails_topics_loading) return <div className="spinner"></div>;
    return (
      <div className="topics_root">
        <h3 className="title">Topics </h3>
        <p className="subtitle">
          {" "}
          Those are done using BertTopic and for the english emails only, select
          a topic to show its emails{" "}
        </p>
        <ul className="custom_ul without_scroll">
          {Object.entries(emails_topics.topics).map(([topicId, info]) => (
            <li
              key={topicId}
              className={`${topicId === selected_topic ? "active" : ""}`}
              onClick={() => set_selected_topic(topicId)}
            >
              <p>
                {info.name} <span className="count">{info.count}</span>{" "}
              </p>
            </li>
          ))}
        </ul>

        {selected_topic && (
          <div className="topic_emails">
            <h3>
              Emails for topic {emails_topics.topics[selected_topic].name}: (
              {emails_topics.topic_mails[selected_topic]?.length || 0} emails)
            </h3>

            <EmailsList
              emails={emails.filter((em) =>
                emails_topics.topic_mails[selected_topic].includes(em.mail_id)
              )}
              hideSaveBtn={true}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="dataset_root">
      <Section title="Emails of active dataset" section_key="dataset_emails_r">
        <h3 className="title">Those are emails saved in the active dataset </h3>
        <p className="subtitle">
          You can click on one email to see details or scroll down for analyzing
          the dataset
        </p>
        <EmailsList
          loading={loading_emails}
          error={emails_error}
          emails={emails}
          title={""}
          hideSaveBtn={true}
          section_key="section_emails"
        />
      </Section>
      <Section title={"Dataset stats"} section_key="sections_stats_r">
        <>
          {ds_stats_fired ? (
            <Stats />
          ) : (
            <>
              <p>
                If you want to get the dataset basic stats, press on the button
                below
              </p>

              <Button onClick={get_stats_fn} loading={loading_ds_stats}>
                Get dataset stats
              </Button>
            </>
          )}
        </>
      </Section>
      <Section title="Email topics" section_key="section_email_topics">
        {emails_topics_fired ? (
          <Topics />
        ) : (
          <>
            <p>
              If you want to get the topics of emails, press on the button below
            </p>

            <Button
              onClick={() => get_emails_topics()}
              loading={emails_topics_loading}
            >
              Get topics
            </Button>
          </>
        )}
      </Section>
      <Section title="TF_IDF" section_key="section_tfidf_r">
        {tfidf_fired ? (
          <TFIDF />
        ) : (
          <>
            <p>
              If you want to get the tfidf of the table, press on the button
              below
            </p>

            <Button onClick={() => get_tfidf_fn(0)} loading={tfidf_loading}>
              Get tfidf
            </Button>
          </>
        )}
      </Section>
    </div>
  );
}
