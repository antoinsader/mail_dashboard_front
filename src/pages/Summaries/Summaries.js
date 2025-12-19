import { useEffect, useState } from "react";
import Section from "../../components/Section/Section";
import toast from "react-hot-toast";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";

export default function Summaries() {
  const [one_email_index, set_one_email_index] = useState(0);
  const [one_email_loading, set_one_email_loading] = useState(false);
  const [one_email_data, set_one_email_data] = useState();
  const [one_email_error, set_one_email_error] = useState();

  const get_one_email = (email_idx) => {
    set_one_email_loading(true);
    set_one_email_error(null);
    set_one_email_data(null);

    try {
      const body = {
        email_idx: one_email_index,
      };
    } catch (ex) {
      console.error("Error loading ds: ", ex);
      toast.error("Error loading the dataset emails");
      set_one_email_error("Error loading one email");
    } finally {
      set_one_email_loading(false);
    }
  };

  useEffect(() => {
    // get_one_email
  }, []);

  return (
    <div className="summaries_root">
      <h2> Email summaries</h2>

      <div className="email_index_container">
        <FaArrowAltCircleLeft
          className={one_email_loading || one_email_index === 0 ? "disabled" : ""}
          onClick={() => {
            if (!one_email_loading && one_email_index > 0)
                get_one_email(one_email_index - 1);
          }}
        />

        <h3 className="title document">
          Current document idx: {one_email_loading ? "" : one_email_index + 1}
        </h3>
        <FaArrowAltCircleRight
          className={one_email_loading ? "disabled" : ""}
          onClick={() => {
            if (!one_email_loading) get_one_email(one_email_index + 1);
          }}
        />
      </div>

      <Section
        title="Email content"
        section_key="summaries_one_email_content_r"
      >
        <h2> The email </h2>
      </Section>
    </div>
  );
}
