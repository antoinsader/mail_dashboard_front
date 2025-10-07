import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { postRequest } from "../../api/requests";
import { useCache } from "../../context/CacheContext";

import EmailsList from "../../components/EmailsList/EmailsList";

import "./DataSet.scss";
import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import Section from "../../components/Section/Section";
import DataTable from "../../components/DataTable/DataTable";
import EmailHtmlDisplay from "../../components/EmailHtmlDisplay/EmailHtmlDisplay";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";

export default function DataSet() {
  const { local_storage_keys, getCache } = useCache();
  const active_ds_id = getCache(local_storage_keys.active_ds)[0];

  const [emails, set_emails] = useState();
  const [loading_emails, set_loading_emails] = useState(false);
  const [emails_error, set_emails_error] = useState("");

  const [ds_stats, set_ds_stats] = useState({});
  const [loading_ds_stats, set_loading_ds_stats] = useState(false);

  const [most_common_count, set_most_common_count] = useState(50);

  const [tfidf_doc_idx, set_tfidf_doc_idx] = useState(0);
  const [tfidf_result, set_tfidf_result] = useState(null);
  const [loading_tfidf, set_loading_tfidf] = useState(false);

  const [selected_topic, set_selected_topic] = useState(null);
  const [topics_result, set_topics_result] = useState(null);
  const [loading_topics, set_loading_topics] = useState(false);

  const performTfIDF = async (doc_idx) => {
    set_loading_tfidf(true);

    const body = { ds_id: active_ds_id, doc_idx: doc_idx ? doc_idx : 0 };
    console.log("body:  ", body);
    set_tfidf_doc_idx(body.doc_idx);
    try {
      const res = await postRequest({
        route: "ds_registry/get_doc_stats",
        body,
      });
      set_tfidf_result(res.tfidf_terms);
    } catch (ex) {
      console.error("Error loading tfidf: ", ex);
      toast.error("Error in performing the tfidf");
    } finally {
      set_loading_tfidf(false);
    }
  };

  useEffect(() => {
    if (!active_ds_id) return;
    const get_topics = async () => {
      try {
        const res = await postRequest({
          route: "ds_registry/get_ds_bert_topics",
          body: { ds_id: active_ds_id },
        });
        if (res) {
          set_topics_result(res);
        }
      } catch (ex) {
        console.error("Error loading topics: ", ex);
        toast.error("Error loading the dataset topics");
      } finally {
        set_loading_topics(false);
      }
    };
    const get_emails = async () => {
      set_loading_emails(true);
      set_loading_topics(true);

      try {
        const res = await postRequest({
          route: "ds_registry/get_ds_main_data_by_id",
          body: { ds_id: active_ds_id },
        });
        if (res) {
          set_emails(res);
          get_topics();
        }
      } catch (ex) {
        console.error("Error loading ds: ", ex);
        toast.error("Error loading the dataset emails");
        set_emails_error("Error loading the ds emails");
        set_loading_topics(false);
      } finally {
        set_loading_emails(false);
      }
    };
    const get_stats = async () => {
      set_loading_ds_stats(true);
      try {
        const res = await postRequest({
          route: "ds_registry/get_ds_stats",
          body: { ds_id: active_ds_id, most_common_count: most_common_count },
        });
        if (res) {
          set_ds_stats(res);
        }
      } catch (ex) {
        console.error("Error loading stats: ", ex);
        toast.error("Error loading the dataset stats");
      } finally {
        set_loading_ds_stats(false);
      }
    };

    get_emails();
    get_stats();
  }, [active_ds_id]);

  if (!active_ds_id)
    return (
      <h2 className="title">
        You have to select dataset from <Link to="/home"> home </Link>{" "}
      </h2>
    );

  return (
    <div className="dataset_root">
      <h1 className="title"> Dataset</h1>

      <Section title={"Emails of active dataset"} section_key="ds_mails">
        <EmailsList
          loading={loading_emails}
          error={emails_error}
          emails={emails}
          title={""}
          hideSaveBtn={true}
          section_key="section_emails"
        />
      </Section>

      <Section
        title="Basic dataset stats"
        section_class="section_stats"
        section_key="section_stats"
      >
        {loading_ds_stats ? (
          <div className="spinner"></div>
        ) : (
          <>
            {ds_stats.languages && (
              <div className="lang_used">
                <h3> Languages used: </h3>
                <ul>
                  {Object.entries(ds_stats.languages).map(
                    ([lang_code, count], idx) => (
                      <li key={idx}>
                        <p>
                          {" "}
                          {lang_code}: {count}
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
        )}
      </Section>

      <Section
        title="Perform TF-IDF"
        section_key="section_tfidf"
        section_class="tfidf"
      >
        {!tfidf_result && (
          <button
            className="primary btn_tfidf"
            disabled={loading_tfidf}
            onClick={() => performTfIDF(0)}
          >
            {loading_tfidf ? <span className="spinner"></span> : ""} Start
            tf-idf
          </button>
        )}

        {tfidf_result && (
          <div className="tfidf_doc">
            <div className="document_id_header">
              <FaArrowAltCircleLeft
                className={
                  loading_tfidf || tfidf_doc_idx === 0 ? "disabled" : ""
                }
                onClick={() => {
                  if (!loading_tfidf && tfidf_doc_idx > 0)
                    performTfIDF(tfidf_doc_idx - 1);
                }}
              />

              <h3 className="title document">
                Current document id: {loading_tfidf ? "" : tfidf_result.doc_id}
              </h3>
              <FaArrowAltCircleRight
                className={loading_tfidf ? "disabled" : ""}
                onClick={() => {
                  if (!loading_tfidf) performTfIDF(tfidf_doc_idx + 1);
                }}
              />
            </div>
            <p className="subtitle">Here, we are using only the english data</p>

            {loading_tfidf ? (
              <div className="spinner"></div>
            ) : (
              <>
                <p className="badge"> Language: {tfidf_result.language} </p>
                <p className="subtitle">
                  <b>Email text: </b> {tfidf_result.doc_text}{" "}
                </p>

                <h2 className="title"> Top terms: </h2>
              </>
            )}
            <DataTable
              columns={[
                { field: "term", label: "Term" },
                { field: "tfidf_score", label: "TF-IDF score" },
              ]}
              data={tfidf_result.top_terms}
              hide_rows_per_page={true}
              loading={loading_tfidf}
            />
            {!loading_tfidf && (
              <>
                <h3>All tokens: </h3>
                <div className="tokens">
                  {tfidf_result.tokens.map((tok, idx) => (
                    <span key={idx} className="tok_span">
                      {" "}
                      {tok}{" "}
                    </span>
                  ))}
                </div>
                <h3>Email html content: </h3>
                <EmailHtmlDisplay html={tfidf_result.html} />
              </>
            )}
          </div>
        )}
      </Section>

      <Section
        title="Topics in email"
        section_key="section_topics"
        section_class="topics"
      >
        {loading_topics ? (
          <div>
            <p>
              {" "}
              This might take a while the first time extracting topics for the
              dataset
            </p>
            <div className="spinner"></div>
          </div>
        ) : (
          topics_result && (
            <div className="topics_root">
              <div className="topics_chips">
                {Object.entries(topics_result.topics).map(([topicId, info]) => (
                  <div
                    key={topicId}
                    className={`topic_chip ${
                      topicId === selected_topic ? "active" : ""
                    }`}
                    onClick={() => set_selected_topic(topicId)}
                  >
                    <h4>{info.name}</h4>
                    <span className="count">{info.count}</span>
                  </div>
                ))}
              </div>

              {selected_topic && (
                <div className="topic_emails">
                  <h3>
                    Emails for topic{" "}
                    <b>{topics_result.topics[selected_topic].name}</b>
                  </h3>
                  <EmailsList
                    emails={emails.filter((em) =>
                      topics_result.topic_mails[selected_topic].includes(em.id)
                    )}
                    hideSaveBtn={true}
                  />
                </div>
              )}
            </div>
          )
        )}
      </Section>
    </div>
  );
}
